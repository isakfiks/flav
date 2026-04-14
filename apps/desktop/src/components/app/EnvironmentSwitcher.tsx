import { useApp } from '@desktop/context/AppContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

const EnvironmentSwitcher = () => {
  const { state, dispatch } = useApp();
  const activeEnv = state.environments.find(e => e.active);

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-3.5 h-3.5 text-muted-foreground" />
      <Select
        value={activeEnv?.id || ''}
        onValueChange={(id) => dispatch({ type: 'SET_ACTIVE_ENV', payload: id })}
      >
        <SelectTrigger className="h-7 text-xs border-border/50 bg-transparent w-36 focus:ring-0">
          <SelectValue placeholder="No Environment" />
        </SelectTrigger>
        <SelectContent>
          {state.environments.map((env) => (
            <SelectItem key={env.id} value={env.id} className="text-xs">
              {env.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EnvironmentSwitcher;
