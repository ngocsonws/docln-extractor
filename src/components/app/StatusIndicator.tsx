import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  status: 'loading' | 'ready' | 'error';
  text: string;
}

export function StatusIndicator({ status, text }: StatusIndicatorProps) {
  return (
    <div className="px-6 py-3 border-b">
      <div className="flex items-center gap-2">
        <div
          className={cn(
            'w-2 h-2 rounded-full',
            status === 'loading' && 'bg-muted-foreground animate-pulse',
            status === 'ready' && 'bg-foreground',
            status === 'error' && 'bg-destructive'
          )}
        />
        <span className="text-sm text-muted-foreground">{text}</span>
      </div>
    </div>
  );
}
