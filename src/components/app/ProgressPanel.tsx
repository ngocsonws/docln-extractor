import { Progress } from '@/components/ui/progress';

interface ProgressPanelProps {
  percent: number;
  title: string;
  detail: string;
}

export function ProgressPanel({ percent, title, detail }: ProgressPanelProps) {
  return (
    <div className="px-6 py-4 border-t">
      <div className="flex items-center justify-between mb-2 text-sm">
        <span>{title}</span>
        <span className="text-muted-foreground">{Math.round(percent)}%</span>
      </div>
      <Progress value={percent} className="h-1.5 mb-1" />
      <p className="text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}
