import { useMemo, useState } from 'react';
import { useApp } from '@desktop/context/AppContext';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  CheckCircle,
  XCircle,
  Clock,
  HardDrive,
  Loader2,
  Copy,
  Search,
} from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  formatResponseBody,
  resolveResponseFormat,
  ResponseFormatMode,
} from '@desktop/lib/request-utils';

type BodyViewMode = 'pretty' | 'raw' | 'preview';

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const countMatches = (source: string, query: string) => {
  const trimmed = query.trim();
  if (!trimmed) {
    return 0;
  }

  const matches = source.match(new RegExp(escapeRegExp(trimmed), 'gi'));
  return matches ? matches.length : 0;
};

const renderHighlightedText = (source: string, query: string) => {
  const trimmed = query.trim();
  if (!trimmed) {
    return source;
  }

  const segments = source.split(new RegExp(`(${escapeRegExp(trimmed)})`, 'gi'));
  return segments.map((segment, index) => {
    if (segment.toLowerCase() === trimmed.toLowerCase()) {
      return (
        <mark key={`${segment}-${index}`} className="bg-accent/40 text-code-foreground rounded-sm px-0.5">
          {segment}
        </mark>
      );
    }

    return <span key={`${segment}-${index}`}>{segment}</span>;
  });
};

const ResponsePanel = () => {
  const { state } = useApp();
  const response = state.activeTabId ? state.responses[state.activeTabId] : null;
  const isLoading = state.activeTabId ? state.loading[state.activeTabId] : false;
  const testResults = state.activeTabId ? state.testResults[state.activeTabId] : null;
  const [bodyViewMode, setBodyViewMode] = useState<BodyViewMode>('pretty');
  const [formatMode, setFormatMode] = useState<ResponseFormatMode>('AUTO');
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const responseBody = response?.body ?? '';
  const responseHeaders = response?.headers ?? {};

  const resolvedFormat = useMemo(
    () => resolveResponseFormat(responseBody, responseHeaders, formatMode),
    [responseBody, responseHeaders, formatMode],
  );

  const formattedBody = useMemo(
    () => formatResponseBody(responseBody, resolvedFormat),
    [responseBody, resolvedFormat],
  );

  const renderedBody = bodyViewMode === 'raw' ? responseBody : formattedBody;
  const matchCount = useMemo(() => countMatches(renderedBody, searchQuery), [renderedBody, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center border-t border-border bg-card/50">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Sending request...</span>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex-1 flex items-center justify-center border-t border-border bg-card/30">
        <div className="text-center text-muted-foreground">
          <p className="text-sm font-medium">Response</p>
          <p className="text-xs mt-1">Send a request to see the response here</p>
        </div>
      </div>
    );
  }

  const statusColor = response.status >= 200 && response.status < 300
    ? 'text-emerald-500'
    : response.status >= 400
      ? 'text-red-500'
      : response.status >= 300
        ? 'text-amber-500'
        : 'text-muted-foreground';

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(renderedBody);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col border-t border-border min-h-0 animate-panel-in">
      <div className="flex items-center gap-4 px-3 py-2 border-b border-border bg-card/50 animate-blur-rise">
        <div className="flex items-center gap-1.5">
          <div className={cn('w-2 h-2 rounded-full animate-pulse-soft', response.status >= 200 && response.status < 300 ? 'bg-emerald-500' : response.status >= 400 ? 'bg-red-500' : 'bg-amber-500')} />
          <span className={cn('text-xs font-bold', statusColor)}>
            {response.status} {response.statusText}
          </span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span className="text-xs">{response.time}ms</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <HardDrive className="w-3 h-3" />
          <span className="text-xs">{formatSize(response.size)}</span>
        </div>
      </div>

      <Tabs defaultValue="body" className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-3 mt-1 bg-transparent justify-start gap-0 h-auto p-0 border-b border-border rounded-none">
          <TabsTrigger value="body" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs px-3 py-2">
            Body
          </TabsTrigger>
          <TabsTrigger value="headers" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs px-3 py-2">
            Headers
            <span className="ml-1.5 text-[10px] bg-muted px-1.5 rounded-full">
              {Object.keys(response.headers).length}
            </span>
          </TabsTrigger>
          {testResults && testResults.length > 0 && (
            <TabsTrigger value="tests" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs px-3 py-2">
              Tests
              <span className={cn(
                'ml-1.5 text-[10px] px-1.5 rounded-full',
                testResults.every(t => t.passed) ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
              )}>
                {testResults.filter(t => t.passed).length}/{testResults.length}
              </span>
            </TabsTrigger>
          )}
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="body" className="m-0 h-full data-[state=active]:flex data-[state=active]:flex-col">
            <div className="h-full flex flex-col">
              <div className="px-3 py-2 border-b border-border bg-card/50 flex flex-wrap items-center gap-2">
                <ToggleGroup
                  type="single"
                  value={bodyViewMode}
                  onValueChange={(value) => {
                    if (value) {
                      setBodyViewMode(value as BodyViewMode);
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="justify-start"
                >
                  <ToggleGroupItem value="pretty" className="text-xs h-8 px-2.5">Pretty</ToggleGroupItem>
                  <ToggleGroupItem value="raw" className="text-xs h-8 px-2.5">Raw</ToggleGroupItem>
                  <ToggleGroupItem value="preview" className="text-xs h-8 px-2.5">Preview</ToggleGroupItem>
                </ToggleGroup>

                <Select value={formatMode} onValueChange={(value) => setFormatMode(value as ResponseFormatMode)}>
                  <SelectTrigger className="h-8 w-[120px] text-xs bg-card/80 backdrop-blur-sm">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent className="animate-dropdown-blur">
                    <SelectItem value="AUTO">AUTO</SelectItem>
                    <SelectItem value="JSON">JSON</SelectItem>
                    <SelectItem value="HTML">HTML</SelectItem>
                    <SelectItem value="XML">XML</SelectItem>
                    <SelectItem value="TEXT">TEXT</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={handleCopyToClipboard}
                >
                  <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied' : 'Copy'}
                </Button>

                <Button
                  variant={searchVisible ? 'secondary' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => {
                    setSearchVisible(prev => !prev);
                    if (searchVisible) {
                      setSearchQuery('');
                    }
                  }}
                >
                  <Search className="w-3.5 h-3.5" /> Find
                </Button>

                {searchVisible && (
                  <div className="flex items-center gap-2 ml-auto">
                    <Input
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search response"
                      className="h-8 w-48 text-xs"
                    />
                    <span className="text-[11px] text-muted-foreground shrink-0">
                      {matchCount} matches
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto scroll-smooth bg-code-bg text-code-foreground animate-content-flow">
                {bodyViewMode === 'preview' && resolvedFormat === 'HTML' ? (
                  <iframe
                    title="Response Preview"
                    className="w-full h-full bg-white"
                    sandbox=""
                    srcDoc={responseBody}
                  />
                ) : (
                  <pre className="min-h-full p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
                    {renderHighlightedText(renderedBody, searchQuery)}
                  </pre>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="headers" className="m-0 h-full p-3 overflow-y-auto overflow-x-hidden animate-content-flow">
            <div className="space-y-1">
              {Object.entries(response.headers).map(([key, value]) => (
                <div key={key} className="flex gap-3 text-xs py-1 border-b border-border/50 last:border-0">
                  <span className="font-medium text-foreground shrink-0 font-mono">{key}</span>
                  <span className="text-muted-foreground truncate font-mono">{value}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          {testResults && (
            <TabsContent value="tests" className="m-0 h-full p-3 overflow-y-auto overflow-x-hidden animate-content-flow">
              <div className="space-y-2">
                {testResults.map((result, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex items-start gap-2 p-2.5 rounded-lg text-xs',
                      result.passed ? 'bg-emerald-500/5' : 'bg-red-500/5'
                    )}
                  >
                    {result.passed ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-medium">{result.name}</span>
                      {result.message && (
                        <p className="text-muted-foreground mt-0.5">{result.message}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default ResponsePanel;
