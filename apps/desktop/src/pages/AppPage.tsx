import { useEffect } from 'react';
import { AppProvider, useApp } from '@desktop/context/AppContext';
import AppNav from '@desktop/components/app/AppNav';
import AppSidebar from '@desktop/components/app/AppSidebar';
import RequestTabs from '@desktop/components/app/RequestTabs';
import RequestPanel from '@desktop/components/app/RequestPanel';
import ResponsePanel from '@desktop/components/app/ResponsePanel';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';

const AppWorkspace = () => {
  const { createRequest } = useApp();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 't') {
        event.preventDefault();
        createRequest(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [createRequest]);

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden relative">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,hsl(var(--accent)/0.09),transparent_34%),radial-gradient(circle_at_84%_10%,hsl(var(--foreground)/0.05),transparent_28%)]" />
      <AppNav />
      <div className="flex-1 flex min-h-0 relative">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          <RequestTabs />
          <ResizablePanelGroup direction="vertical" className="flex-1 min-h-0">
            <ResizablePanel defaultSize={50} minSize={25} className="min-h-0 overflow-hidden">
              <RequestPanel />
            </ResizablePanel>
            <ResizableHandle className="bg-border/70 hover:bg-accent/60 transition-colors duration-200" />
            <ResizablePanel defaultSize={50} minSize={20} className="min-h-0 overflow-hidden">
              <ResponsePanel />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
};

const AppPage = () => {
  return (
    <AppProvider>
      <AppWorkspace />
    </AppProvider>
  );
};

export default AppPage;
