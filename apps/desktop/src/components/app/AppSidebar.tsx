import { DragEvent, useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Plus,
  FolderOpen,
  Trash2,
  MoreHorizontal,
  FileText,
  GripVertical,
  PenLine,
} from 'lucide-react';
import { useApp } from '@desktop/context/AppContext';
import { ApiRequest, createEmptyCollection, METHOD_COLORS } from '@desktop/types/api';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

type RequestContainerId = string | null;

const AppSidebar = () => {
  const { state, dispatch, createRequest } = useApp();
  const [hoveredCollection, setHoveredCollection] = useState<string | null>(null);
  const [draggingCollectionId, setDraggingCollectionId] = useState<string | null>(null);
  const [draggingRequest, setDraggingRequest] = useState<{ containerId: RequestContainerId; requestId: string } | null>(null);
  const [collectionDropTargetId, setCollectionDropTargetId] = useState<string | null>(null);
  const [requestDropTarget, setRequestDropTarget] = useState<{ containerId: RequestContainerId; requestId: string } | null>(null);
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
  const [editingCollectionName, setEditingCollectionName] = useState('');

  const getContainerRequests = (containerId: RequestContainerId) => {
    if (!containerId) {
      return state.standaloneRequests;
    }

    return state.collections.find(collection => collection.id === containerId)?.requests ?? [];
  };

  const handleNewCollection = () => {
    dispatch({ type: 'ADD_COLLECTION', payload: createEmptyCollection() });
  };

  const handleNewRequest = (collectionId?: RequestContainerId) => {
    createRequest(collectionId ?? null);
  };

  const handleOpenRequest = (request: ApiRequest) => {
    dispatch({
      type: 'OPEN_TAB',
      payload: { id: request.id, requestId: request.id, name: request.name, method: request.method },
    });
  };

  const handleDeleteRequest = (containerId: RequestContainerId, requestId: string) => {
    dispatch({ type: 'DELETE_REQUEST', payload: { collectionId: containerId, requestId } });
  };

  const startCollectionRename = (collectionId: string, currentName: string) => {
    setEditingCollectionId(collectionId);
    setEditingCollectionName(currentName);
  };

  const cancelCollectionRename = () => {
    setEditingCollectionId(null);
    setEditingCollectionName('');
  };

  const submitCollectionRename = () => {
    if (!editingCollectionId) {
      return;
    }

    const name = editingCollectionName.trim();
    if (name) {
      dispatch({
        type: 'UPDATE_COLLECTION',
        payload: { collectionId: editingCollectionId, name },
      });
    }

    cancelCollectionRename();
  };

  const handleCollectionDragStart = (event: DragEvent<HTMLDivElement>, collectionId: string) => {
    event.dataTransfer.effectAllowed = 'move';
    setDraggingRequest(null);
    setDraggingCollectionId(collectionId);
  };

  const handleCollectionDragOver = (event: DragEvent<HTMLDivElement>, collectionId: string) => {
    if ((draggingCollectionId && draggingCollectionId !== collectionId) || draggingRequest) {
      event.preventDefault();
      setCollectionDropTargetId(collectionId);
    }
  };

  const clearDragState = () => {
    setDraggingCollectionId(null);
    setDraggingRequest(null);
    setCollectionDropTargetId(null);
    setRequestDropTarget(null);
  };

  const handleCollectionDrop = (event: DragEvent<HTMLDivElement>, collectionId: string) => {
    event.preventDefault();

    if (draggingRequest) {
      const sourceRequests = getContainerRequests(draggingRequest.containerId);
      const targetRequests = getContainerRequests(collectionId);
      const fromIndex = sourceRequests.findIndex(request => request.id === draggingRequest.requestId);

      if (fromIndex >= 0) {
        let toIndex = targetRequests.length;

        if (draggingRequest.containerId === collectionId && fromIndex < toIndex) {
          toIndex -= 1;
        }

        dispatch({
          type: 'REORDER_REQUESTS',
          payload: {
            fromCollectionId: draggingRequest.containerId,
            toCollectionId: collectionId,
            fromIndex,
            toIndex,
          },
        });
      }

      clearDragState();
      return;
    }

    if (!draggingCollectionId || draggingCollectionId === collectionId) {
      clearDragState();
      return;
    }

    const fromIndex = state.collections.findIndex(c => c.id === draggingCollectionId);
    const toIndex = state.collections.findIndex(c => c.id === collectionId);

    if (fromIndex >= 0 && toIndex >= 0) {
      dispatch({ type: 'REORDER_COLLECTIONS', payload: { fromIndex, toIndex } });
    }

    clearDragState();
  };

  const handleRequestDragStart = (
    event: DragEvent<HTMLDivElement>,
    containerId: RequestContainerId,
    requestId: string,
  ) => {
    event.dataTransfer.effectAllowed = 'move';
    setDraggingCollectionId(null);
    setDraggingRequest({ containerId, requestId });
  };

  const handleRequestDragOver = (
    event: DragEvent<HTMLDivElement>,
    containerId: RequestContainerId,
    requestId: string,
  ) => {
    if (!draggingRequest) return;
    if (draggingRequest.containerId === containerId && draggingRequest.requestId === requestId) return;

    event.preventDefault();
    event.stopPropagation();
    setRequestDropTarget({ containerId, requestId });
  };

  const handleRequestDrop = (
    event: DragEvent<HTMLDivElement>,
    containerId: RequestContainerId,
    requestId: string,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!draggingRequest) {
      clearDragState();
      return;
    }

    const sourceRequests = getContainerRequests(draggingRequest.containerId);
    const targetRequests = getContainerRequests(containerId);

    const fromIndex = sourceRequests.findIndex(request => request.id === draggingRequest.requestId);
    const targetIndex = targetRequests.findIndex(request => request.id === requestId);

    if (fromIndex < 0 || targetIndex < 0) {
      clearDragState();
      return;
    }

    let toIndex = targetIndex;
    if (draggingRequest.containerId === containerId && fromIndex < targetIndex) {
      toIndex = targetIndex - 1;
    }

    dispatch({
      type: 'REORDER_REQUESTS',
      payload: {
        fromCollectionId: draggingRequest.containerId,
        toCollectionId: containerId,
        fromIndex,
        toIndex,
      },
    });

    clearDragState();
  };

  const handleRequestContainerDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (!draggingRequest) return;
    event.preventDefault();
    event.stopPropagation();
  };

  const handleRequestContainerDrop = (event: DragEvent<HTMLDivElement>, containerId: RequestContainerId) => {
    event.preventDefault();
    event.stopPropagation();

    if (!draggingRequest) {
      clearDragState();
      return;
    }

    const sourceRequests = getContainerRequests(draggingRequest.containerId);
    const targetRequests = getContainerRequests(containerId);
    const fromIndex = sourceRequests.findIndex(request => request.id === draggingRequest.requestId);

    if (fromIndex < 0) {
      clearDragState();
      return;
    }

    let toIndex = targetRequests.length;
    if (draggingRequest.containerId === containerId && fromIndex < toIndex) {
      toIndex -= 1;
    }

    dispatch({
      type: 'REORDER_REQUESTS',
      payload: {
        fromCollectionId: draggingRequest.containerId,
        toCollectionId: containerId,
        fromIndex,
        toIndex,
      },
    });

    clearDragState();
  };

  const renderRequestItem = (request: ApiRequest, containerId: RequestContainerId) => {
    const isDropTarget =
      requestDropTarget?.containerId === containerId && requestDropTarget.requestId === request.id;

    return (
      <ContextMenu key={request.id}>
        <ContextMenuTrigger asChild>
          <div
            draggable
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 cursor-pointer rounded-md mx-1 group transition-all duration-200',
              state.activeTabId === request.id
                ? 'bg-muted text-foreground'
                : 'hover:bg-muted/40 text-muted-foreground hover:text-foreground',
              isDropTarget ? 'ring-1 ring-inset ring-accent/40 bg-accent/10' : '',
              draggingRequest?.requestId === request.id ? 'opacity-60' : ''
            )}
            onClick={() => handleOpenRequest(request)}
            onDragStart={(event) => handleRequestDragStart(event, containerId, request.id)}
            onDragOver={(event) => handleRequestDragOver(event, containerId, request.id)}
            onDragEnd={clearDragState}
            onDrop={(event) => handleRequestDrop(event, containerId, request.id)}
          >
            <GripVertical className="w-3 h-3 text-muted-foreground/60 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className={cn('text-[10px] font-bold tracking-wide shrink-0', METHOD_COLORS[request.method])}>
              {request.method}
            </span>
            <span className="text-xs truncate flex-1">{request.name}</span>
            <button
              onClick={(event) => {
                event.stopPropagation();
                handleDeleteRequest(containerId, request.id);
              }}
              className="p-0.5 rounded opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-44">
          <ContextMenuItem onClick={() => handleOpenRequest(request)}>
            <FileText className="w-3.5 h-3.5 mr-2" /> Open Request
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            className="text-destructive"
            onClick={() => handleDeleteRequest(containerId, request.id)}
          >
            <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Request
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  };

  return (
    <aside
      className={cn(
        'border-r border-border bg-card flex flex-col h-full overflow-hidden transition-all duration-200 ease-out',
        state.sidebarCollapsed
          ? 'w-0 -translate-x-1 opacity-0 pointer-events-none border-r-0'
          : 'w-64 translate-x-0 opacity-100 animate-slide-in-left'
      )}
    >
      <div
        className={cn(
          'h-full flex flex-col transition-opacity duration-150',
          state.sidebarCollapsed ? 'opacity-0' : 'opacity-100'
        )}
      >
        <div className="p-3 border-b border-border flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Workspace
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleNewRequest(null)}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="New Request"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNewCollection}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="New Collection"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-1">
          <div className="px-3 pt-2 pb-1 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Requests</span>
            <button
              onClick={() => handleNewRequest(null)}
              className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
              title="Add Request"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div
            className="pb-2 border-b border-border/60"
            onDragOver={handleRequestContainerDragOver}
            onDrop={(event) => handleRequestContainerDrop(event, null)}
          >
            {state.standaloneRequests.map(request => renderRequestItem(request, null))}
            {state.standaloneRequests.length === 0 && (
              <p className="text-[10px] text-muted-foreground px-3 py-2 italic">Drop requests here</p>
            )}
          </div>

          <div className="px-3 pt-3 pb-1 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Collections</span>
            <button
              onClick={handleNewCollection}
              className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
              title="Add Collection"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {state.collections.map((collection) => (
            <div key={collection.id}>
              <ContextMenu>
                <ContextMenuTrigger asChild>
                  <div
                    draggable={editingCollectionId !== collection.id}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 cursor-pointer transition-colors duration-200 group rounded-md mx-1',
                      collectionDropTargetId === collection.id
                        ? 'bg-accent/10 ring-1 ring-inset ring-accent/35'
                        : 'hover:bg-muted/50',
                      draggingCollectionId === collection.id ? 'opacity-60' : ''
                    )}
                    onClick={() => {
                      if (editingCollectionId !== collection.id) {
                        dispatch({ type: 'TOGGLE_COLLECTION', payload: collection.id });
                      }
                    }}
                    onDoubleClick={(event) => {
                      event.stopPropagation();
                      startCollectionRename(collection.id, collection.name);
                    }}
                    onMouseEnter={() => setHoveredCollection(collection.id)}
                    onMouseLeave={() => setHoveredCollection(null)}
                    onDragStart={(event) => handleCollectionDragStart(event, collection.id)}
                    onDragOver={(event) => handleCollectionDragOver(event, collection.id)}
                    onDragEnd={clearDragState}
                    onDrop={(event) => handleCollectionDrop(event, collection.id)}
                  >
                    <GripVertical className="w-3 h-3 text-muted-foreground/60 shrink-0" />
                    {collection.expanded ? (
                      <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                    )}
                    <FolderOpen className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    {editingCollectionId === collection.id ? (
                      <input
                        autoFocus
                        value={editingCollectionName}
                        onChange={(event) => setEditingCollectionName(event.target.value)}
                        onClick={(event) => event.stopPropagation()}
                        onDoubleClick={(event) => event.stopPropagation()}
                        onBlur={submitCollectionRename}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            submitCollectionRename();
                          }

                          if (event.key === 'Escape') {
                            event.preventDefault();
                            cancelCollectionRename();
                          }
                        }}
                        className="flex-1 text-xs font-medium bg-background border border-border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-ring"
                      />
                    ) : (
                      <span className="text-xs font-medium truncate flex-1">{collection.name}</span>
                    )}
                    {hoveredCollection === collection.id && (
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            handleNewRequest(collection.id);
                          }}
                          className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              onClick={(event) => event.stopPropagation()}
                              className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <MoreHorizontal className="w-3 h-3" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => handleNewRequest(collection.id)}>
                              <FileText className="w-3.5 h-3.5 mr-2" /> Add Request
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => startCollectionRename(collection.id, collection.name)}>
                              <PenLine className="w-3.5 h-3.5 mr-2" /> Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => dispatch({ type: 'DELETE_COLLECTION', payload: collection.id })}
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-44">
                  <ContextMenuItem onClick={() => handleNewRequest(collection.id)}>
                    <FileText className="w-3.5 h-3.5 mr-2" /> Add Request
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => startCollectionRename(collection.id, collection.name)}>
                    <PenLine className="w-3.5 h-3.5 mr-2" /> Rename Collection
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem
                    className="text-destructive"
                    onClick={() => dispatch({ type: 'DELETE_COLLECTION', payload: collection.id })}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Collection
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>

              {collection.expanded && (
                <div
                  className="ml-4"
                  onDragOver={handleRequestContainerDragOver}
                  onDrop={(event) => handleRequestContainerDrop(event, collection.id)}
                >
                  {collection.requests.map(request => renderRequestItem(request, collection.id))}
                  {collection.requests.length === 0 && (
                    <p className="text-[10px] text-muted-foreground px-3 py-2 italic">Drop requests here</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
