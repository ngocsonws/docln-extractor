import type { NovelInfo } from '@/types';
import { Badge } from '@/components/ui/badge';

interface NovelCardProps {
  novelInfo: NovelInfo;
}

export function NovelCard({ novelInfo }: NovelCardProps) {
  return (
    <div className="px-6 py-4 border-b">
      <h2 className="font-medium text-sm leading-tight line-clamp-2 mb-1">
        {novelInfo.title || 'Untitled'}
      </h2>
      <p className="text-xs text-muted-foreground mb-2">
        {novelInfo.author || 'Unknown'}
      </p>
      <div className="flex gap-2">
        <Badge variant="secondary" className="text-xs">
          {novelInfo.volumes.length} vol
        </Badge>
        <Badge variant="secondary" className="text-xs">
          {novelInfo.totalChapters} ch
        </Badge>
      </div>
    </div>
  );
}
