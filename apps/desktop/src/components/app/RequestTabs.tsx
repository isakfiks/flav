import { Plus, X } from 'lucide-react';
import { useApp } from '@desktop/context/AppContext';
import { cn } from '@/lib/utils';
import { METHOD_COLORS } from '@desktop/types/api';

const RequestTabs = () => {
  const { state, dispatch, createRequest } = useApp();

  return (
    <div className="flex items-center border-b border-border bg-card/60 backdrop-blur-sm overflow-x-auto">
      <div className="flex items-center overflow-x-auto flex-1">
        {state.tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.id })}
            onMouseDown={(e) => {
              if (e.button === 1) {
                e.preventDefault();
                dispatch({ type: 'CLOSE_TAB', payload: tab.id });
              }
            }}
            className={cn(
              'flex items-center gap-2 px-3 py-2 border-r border-border cursor-pointer text-xs transition-all duration-200 group min-w-0 shrink-0',
              state.activeTabId === tab.id
                ? 'bg-background/90 text-foreground shadow-[inset_0_-2px_0_hsl(var(--accent))]'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
            )}
          >
            <span className={cn('text-[10px] font-bold shrink-0', METHOD_COLORS[tab.method])}>
              {tab.method}
            </span>
            <span className="truncate max-w-[120px]">{tab.name}</span>
            {tab.dirty && (
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            )}
            <button
              onClick={(e) => { e.stopPropagation(); dispatch({ type: 'CLOSE_TAB', payload: tab.id }); }}
              className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-muted transition-all shrink-0"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => createRequest(null)}
        className="mx-1 h-8 w-8 rounded-md inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
        title="New Request"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default RequestTabs;
