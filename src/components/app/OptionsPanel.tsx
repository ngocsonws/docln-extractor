import type { Volume } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface OptionsPanelProps {
  volumes: Volume[];
  selectedVolumes: Set<number>;
  splitVolumes: boolean;
  onSplitVolumesChange: (value: boolean) => void;
  onVolumeToggle: (index: number) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export function OptionsPanel({
  volumes,
  selectedVolumes,
  splitVolumes,
  onSplitVolumesChange,
  onVolumeToggle,
  onSelectAll,
  onDeselectAll,
}: OptionsPanelProps) {
  return (
    <div className="px-6 py-4 space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="split-volumes"
          checked={splitVolumes}
          onCheckedChange={(checked) => onSplitVolumesChange(checked === true)}
        />
        <label htmlFor="split-volumes" className="text-sm">
          Split by volume
        </label>
      </div>

      <div className="pt-4 border-t">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Volumes</span>
          <div className="flex items-center gap-1 text-xs">
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0"
              onClick={onSelectAll}
            >
              All
            </Button>
            <span className="text-muted-foreground">/</span>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0"
              onClick={onDeselectAll}
            >
              None
            </Button>
          </div>
        </div>

        <div className="max-h-40 overflow-y-auto space-y-1">
          {volumes.map((volume, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-1.5"
            >
              <div className="flex items-center space-x-2 min-w-0">
                <Checkbox
                  id={`volume-${index}`}
                  checked={selectedVolumes.has(index)}
                  onCheckedChange={() => onVolumeToggle(index)}
                />
                <label
                  htmlFor={`volume-${index}`}
                  className="text-sm truncate cursor-pointer"
                  title={volume.title}
                >
                  {volume.title}
                </label>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                {volume.chapters.length}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
