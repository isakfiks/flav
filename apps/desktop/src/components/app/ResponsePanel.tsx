import { useEffect, useMemo, useRef, useState, type WheelEvent } from 'react';
import { useApp } from '@desktop/context/AppContext';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  ChevronDown,
  ChevronUp,
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

const PREVIEW_SCROLL_STYLE =
  '<style id="flav-preview-scroll-fix">html,body{margin:0;min-height:100%;overflow:auto !important;}</style>';

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const countMatches = (source: string, query: string) => {
  const trimmed = query.trim();
  if (!trimmed) {
    return 0;
  }

  const matches = source.match(new RegExp(escapeRegExp(trimmed), 'gi'));
  return matches ? matches.length : 0;
};

const findMatchRanges = (source: string, query: string) => {
  const trimmed = query.trim();
  if (!trimmed) {
    return [] as Array<{ start: number; end: number }>;
  }

  const ranges: Array<{ start: number; end: number }> = [];
  const regex = new RegExp(escapeRegExp(trimmed), 'gi');
  let match: RegExpExecArray | null = null;

  while ((match = regex.exec(source)) !== null) {
    ranges.push({ start: match.index, end: match.index + match[0].length });

    if (regex.lastIndex === match.index) {
      regex.lastIndex += 1;
    }
  }

  return ranges;
};

const buildPreviewDocument = (rawHtml: string) => {
  const value = String(rawHtml || '');

  if (!value.trim()) {
    return `<!doctype html><html><head><meta charset="utf-8"/>${PREVIEW_SCROLL_STYLE}</head><body></body></html>`;
  }

  if (/<head[\s>]/i.test(value)) {
    if (/flav-preview-scroll-fix/i.test(value)) {
      return value;
    }

    if (/<\/head>/i.test(value)) {
      return value.replace(/<\/head>/i, `${PREVIEW_SCROLL_STYLE}</head>`);
    }

    return value.replace(/<head([^>]*)>/i, `<head$1>${PREVIEW_SCROLL_STYLE}`);
  }

  if (/<html[\s>]/i.test(value)) {
    return value.replace(/<html([^>]*)>/i, `<html$1><head>${PREVIEW_SCROLL_STYLE}</head>`);
  }

  return `<!doctype html><html><head><meta charset="utf-8"/>${PREVIEW_SCROLL_STYLE}</head><body>${value}</body></html>`;
};

const forceScrollOnWheel = (event: WheelEvent<HTMLElement>) => {
  const viewport = event.currentTarget;
  const hasVerticalDelta = Math.abs(event.deltaY) > 0;

  if (hasVerticalDelta) {
    const previousTop = viewport.scrollTop;
    viewport.scrollTop = previousTop + event.deltaY;

    if (viewport.scrollTop !== previousTop) {
      event.preventDefault();
      return;
    }
  }

  const horizontalDelta = Math.abs(event.deltaX) > 0 ? event.deltaX : event.shiftKey ? event.deltaY : 0;
  if (horizontalDelta === 0) {
    return;
  }

  const previousLeft = viewport.scrollLeft;
  viewport.scrollLeft = previousLeft + horizontalDelta;
  if (viewport.scrollLeft !== previousLeft) {
    event.preventDefault();
  }
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
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const bodyCodeRef = useRef<HTMLTextAreaElement>(null);

  const responseBody = response?.body ?? '';
  const responseHeaders = response?.headers;

  const resolvedFormat = useMemo(
    () => resolveResponseFormat(responseBody, responseHeaders ?? {}, formatMode),
    [responseBody, responseHeaders, formatMode],
  );

  const formattedBody = useMemo(
    () => formatResponseBody(responseBody, resolvedFormat),
    [responseBody, resolvedFormat],
  );

  const renderedBody = bodyViewMode === 'raw' ? responseBody : formattedBody;
  const isHtmlPreview = bodyViewMode === 'preview' && resolvedFormat === 'HTML';
  const previewDocument = useMemo(() => buildPreviewDocument(responseBody), [responseBody]);
  const matchCount = useMemo(() => countMatches(renderedBody, searchQuery), [renderedBody, searchQuery]);
  const matchRanges = useMemo(() => findMatchRanges(renderedBody, searchQuery), [renderedBody, searchQuery]);
  const visibleMatchCount = bodyViewMode === 'preview' ? 0 : matchCount;
  const responseHeadersText = useMemo(
    () => Object.entries(responseHeaders ?? {}).map(([key, value]) => `${key}: ${value}`).join('\n'),
    [responseHeaders],
  );

  useEffect(() => {
    setActiveMatchIndex(0);
  }, [searchQuery, renderedBody]);

  useEffect(() => {
    if (!searchVisible) {
      return;
    }

    searchInputRef.current?.focus();
    searchInputRef.current?.select();
  }, [searchVisible]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'f') {
        return;
      }

      event.preventDefault();
      setSearchVisible((previous) => {
        if (previous) {
          window.requestAnimationFrame(() => {
            searchInputRef.current?.focus();
            searchInputRef.current?.select();
          });
        }

        return true;
      });
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!searchVisible || !searchQuery.trim() || visibleMatchCount === 0 || bodyViewMode === 'preview') {
      return;
    }

    const textarea = bodyCodeRef.current;
    if (!textarea) {
      return;
    }

    const range = matchRanges[activeMatchIndex];
    if (!range) {
      return;
    }

    const isSearchInputFocused = document.activeElement === searchInputRef.current;
    if (!isSearchInputFocused) {
      textarea.setSelectionRange(range.start, range.end);
    }

    const lineHeight = Number.parseFloat(window.getComputedStyle(textarea).lineHeight || '16') || 16;
    const lineNumber = renderedBody.slice(0, range.start).split('\n').length - 1;
    const nextScrollTop = Math.max(0, lineNumber * lineHeight - textarea.clientHeight / 2);
    textarea.scrollTop = nextScrollTop;
  }, [activeMatchIndex, bodyViewMode, matchRanges, renderedBody, searchQuery, searchVisible, visibleMatchCount]);

  useEffect(() => {
    if (visibleMatchCount === 0) {
      setActiveMatchIndex(0);
      return;
    }

    if (activeMatchIndex >= visibleMatchCount) {
      setActiveMatchIndex(visibleMatchCount - 1);
    }
  }, [activeMatchIndex, visibleMatchCount]);

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

  const goToPreviousMatch = () => {
    if (visibleMatchCount === 0) {
      return;
    }

    setActiveMatchIndex(prev => (prev - 1 + visibleMatchCount) % visibleMatchCount);
  };

  const goToNextMatch = () => {
    if (visibleMatchCount === 0) {
      return;
    }

    setActiveMatchIndex(prev => (prev + 1) % visibleMatchCount);
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

        <div className="flex-1 min-h-0 overflow-hidden">
          <TabsContent
            value="body"
            className="m-0 h-full min-h-0 overflow-hidden data-[state=active]:flex data-[state=active]:flex-col"
          >
            <div className="grid flex-1 min-h-0 grid-rows-[auto_minmax(0,1fr)]">
              <div className="px-3 py-2 border-b border-border bg-card/50 flex flex-nowrap items-center gap-2 overflow-x-auto">
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
                    setSearchVisible(prev => {
                      const next = !prev;

                      if (!next) {
                        setSearchQuery('');
                        setActiveMatchIndex(0);
                      }

                      return next;
                    });
                  }}
                >
                  <Search className="w-3.5 h-3.5" /> Find
                </Button>

                {searchVisible && (
                  <div className="ml-auto flex items-center gap-1.5">
                    <Input
                      ref={searchInputRef}
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search response"
                      className="h-8 w-52 text-xs"
                      onKeyDown={(event) => {
                        if (event.key !== 'Enter') {
                          return;
                        }

                        event.preventDefault();
                        if (event.shiftKey) {
                          goToPreviousMatch();
                          return;
                        }

                        goToNextMatch();
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={goToPreviousMatch}
                      disabled={visibleMatchCount === 0}
                      title="Previous match"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={goToNextMatch}
                      disabled={visibleMatchCount === 0}
                      title="Next match"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </Button>
                    <span className="min-w-[64px] shrink-0 text-right text-[11px] text-muted-foreground">
                      {visibleMatchCount > 0 ? `${activeMatchIndex + 1}/${visibleMatchCount}` : '0 matches'}
                    </span>
                  </div>
                )}
              </div>

              {isHtmlPreview ? (
                <div
                  className="min-h-0 overflow-hidden bg-background animate-content-flow"
                >
                  <iframe
                    title="Response Preview"
                    className="block w-full h-full border-0 bg-white"
                    sandbox=""
                    srcDoc={previewDocument}
                  />
                </div>
              ) : (
                <div className="min-h-0 overflow-hidden bg-code-bg animate-content-flow">
                  <textarea
                    ref={bodyCodeRef}
                    readOnly
                    rows={14}
                    wrap="off"
                    spellCheck={false}
                    value={renderedBody}
                    onWheelCapture={forceScrollOnWheel}
                    className="block h-full min-h-0 w-full resize-none overflow-y-auto overflow-x-auto overscroll-contain bg-code-bg text-code-foreground p-4 font-mono text-xs leading-relaxed outline-none"
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent
            value="headers"
            className="m-0 h-full min-h-0 overflow-hidden animate-content-flow data-[state=active]:flex data-[state=active]:flex-col"
          >
            <div className="h-0 flex-1 min-h-0 overflow-hidden p-3 animate-content-flow">
              <textarea
                readOnly
                rows={14}
                wrap="off"
                spellCheck={false}
                value={responseHeadersText}
                onWheelCapture={forceScrollOnWheel}
                className="block h-full min-h-0 w-full resize-none overflow-y-auto overflow-x-auto overscroll-contain bg-transparent font-mono text-xs leading-relaxed text-foreground outline-none"
              />
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
