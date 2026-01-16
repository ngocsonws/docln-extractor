/**
 * Hook for volume selection management
 */

import { useState, useCallback } from 'react';
import type { NovelInfo } from '@/types';

export interface UseVolumeSelectionResult {
  selectedVolumes: Set<number>;
  handleSelectAll: () => void;
  handleDeselectAll: () => void;
  handleVolumeToggle: (index: number) => void;
}

export function useVolumeSelection(
  novelInfo: NovelInfo | null
): UseVolumeSelectionResult {
  const [selectedVolumes, setSelectedVolumes] = useState<Set<number>>(
    new Set()
  );
  const [lastUrl, setLastUrl] = useState<string | null>(null);

  // Sync state when novel info changes (Adjust state during render)
  if (novelInfo && novelInfo.url !== lastUrl) {
    setLastUrl(novelInfo.url);
    setSelectedVolumes(new Set(novelInfo.volumes.map((_, i) => i)));
  }

  const handleSelectAll = useCallback(() => {
    if (novelInfo) {
      setSelectedVolumes(new Set(novelInfo.volumes.map((_, i) => i)));
    }
  }, [novelInfo]);

  const handleDeselectAll = useCallback(() => {
    setSelectedVolumes(new Set());
  }, []);

  const handleVolumeToggle = useCallback((index: number) => {
    setSelectedVolumes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  return {
    selectedVolumes,
    handleSelectAll,
    handleDeselectAll,
    handleVolumeToggle,
  };
}
