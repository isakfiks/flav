import { useEffect, useState } from 'react';
import {
  PanelLeft,
  Home,
  Minus,
  Square,
  Copy,
  X,
  Menu,
  Plus,
  FolderPlus,
  SendHorizonal,
  Trash2,
  Rows3,
  Maximize2,
  ExternalLink,
  Moon,
  Sun,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { useApp } from '@desktop/context/AppContext';
import { createEmptyCollection } from '@desktop/types/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AppNav = () => {
  const { state, dispatch, createRequest, sendRequest } = useApp();
  const { resolvedTheme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [isMaximized, setIsMaximized] = useState(false);
  const isDarkMode = resolvedTheme === 'dark';

  const activeTab = state.tabs.find(tab => tab.id === state.activeTabId) ?? null;
  const activeRequest = activeTab ? state.requests[activeTab.requestId] : null;

  const getRequestContainerId = (requestId: string) => {
    if (state.standaloneRequests.some(request => request.id === requestId)) {
      return null;
    }

    const collection = state.collections.find(group => group.requests.some(request => request.id === requestId));
    return collection?.id ?? null;
  };

  const handleNewRequest = () => {
    createRequest(null);
  };

  const handleNewCollection = () => {
    dispatch({ type: 'ADD_COLLECTION', payload: createEmptyCollection() });
  };

  const handleCloseActiveTab = () => {
    if (!state.activeTabId) {
      return;
    }

    dispatch({ type: 'CLOSE_TAB', payload: state.activeTabId });
  };

  const handleSendActiveRequest = () => {
    if (!activeRequest) {
      return;
    }

    void sendRequest(activeRequest.id);
  };

  const handleDuplicateActiveRequest = () => {
    if (!activeRequest) {
      return;
    }

    const duplicatedRequest = {
      ...activeRequest,
      id: crypto.randomUUID(),
      name: `${activeRequest.name} Copy`,
      headers: activeRequest.headers.map(header => ({ ...header, id: crypto.randomUUID() })),
      params: activeRequest.params.map(param => ({ ...param, id: crypto.randomUUID() })),
    };

    const collectionId = getRequestContainerId(activeRequest.id);
    dispatch({ type: 'ADD_REQUEST', payload: { request: duplicatedRequest, collectionId } });
    dispatch({
      type: 'OPEN_TAB',
      payload: {
        id: duplicatedRequest.id,
        requestId: duplicatedRequest.id,
        name: duplicatedRequest.name,
        method: duplicatedRequest.method,
      },
    });
  };

  const handleDeleteActiveRequest = () => {
    if (!activeRequest) {
      return;
    }

    dispatch({
      type: 'DELETE_REQUEST',
      payload: {
        requestId: activeRequest.id,
        collectionId: getRequestContainerId(activeRequest.id),
      },
    });
  };

  const openExternal = (url: string) => {
    if (window.arcApi?.openExternal) {
      void window.arcApi.openExternal(url);
      return;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  useEffect(() => {
    const syncWindowState = async () => {
      if (!window.arcWindow?.isMaximized) return;
      const value = await window.arcWindow.isMaximized();
      setIsMaximized(value);
    };

    void syncWindowState();
  }, []);

  const handleToggleMaximize = async () => {
    if (!window.arcWindow?.maximizeToggle) return;
    const nextState = await window.arcWindow.maximizeToggle();
    setIsMaximized(nextState);
  };

  return (
    <header className="app-drag-region h-11 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between pl-2 pr-1">
      <div className="app-no-drag flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 px-2.5 rounded-md inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Menu className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Menu</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>File</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-52">
                <DropdownMenuItem onClick={handleNewRequest}>
                  <Plus className="w-3.5 h-3.5 mr-2" /> New Request
                  <DropdownMenuShortcut>Ctrl+T</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleNewCollection}>
                  <FolderPlus className="w-3.5 h-3.5 mr-2" /> New Collection
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleCloseActiveTab} disabled={!state.activeTabId}>
                  <X className="w-3.5 h-3.5 mr-2" /> Close Tab
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    void window.arcWindow?.close();
                  }}
                >
                  <X className="w-3.5 h-3.5 mr-2" /> Exit flav
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Edit</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-52">
                <DropdownMenuItem onClick={handleSendActiveRequest} disabled={!activeRequest}>
                  <SendHorizonal className="w-3.5 h-3.5 mr-2" /> Send Request
                  <DropdownMenuShortcut>Ctrl+Enter</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicateActiveRequest} disabled={!activeRequest}>
                  <Copy className="w-3.5 h-3.5 mr-2" /> Duplicate Request
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={handleDeleteActiveRequest}
                  disabled={!activeRequest}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Request
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>View</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-52">
                <DropdownMenuItem onClick={toggleTheme}>
                  {isDarkMode ? (
                    <Sun className="w-3.5 h-3.5 mr-2" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 mr-2" />
                  )}
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}>
                  <Rows3 className="w-3.5 h-3.5 mr-2" /> {state.sidebarCollapsed ? 'Show Sidebar' : 'Hide Sidebar'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    void handleToggleMaximize();
                  }}
                >
                  <Maximize2 className="w-3.5 h-3.5 mr-2" /> {isMaximized ? 'Restore Window' : 'Maximize Window'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/')}>
                  <Home className="w-3.5 h-3.5 mr-2" /> Go to Landing
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Help</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-52">
                <DropdownMenuItem
                  onClick={() => {
                    openExternal('https://github.com/isakfiks/flav');
                  }}
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-2" /> GitHub Repository
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    openExternal('https://github.com/isakfiks/flav/issues');
                  }}
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-2" /> Report an Issue
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
        >
          <PanelLeft className="w-4 h-4" />
        </button>
        <Link to="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors duration-200">
          <Home className="w-3.5 h-3.5" />
        </Link>
        <div className="h-4 w-px bg-border" />
        <span className="text-sm font-medium tracking-tight select-none">
          <span className="font-editorial">flav</span>
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="app-no-drag flex items-center">
          <button
            onClick={() => {
              void window.arcWindow?.minimize();
            }}
            className="h-8 w-9 rounded-md inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              void handleToggleMaximize();
            }}
            className="h-8 w-9 rounded-md inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? <Copy className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => {
              void window.arcWindow?.close();
            }}
            className="h-8 w-9 rounded-md inline-flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppNav;
