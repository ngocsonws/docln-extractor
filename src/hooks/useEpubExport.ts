/**
 * Hook for EPUB export functionality
 */

import { useState, useCallback } from 'react';
import type { NovelInfo } from '@/types';
import type { EpubChapter } from '@/lib/epub';
import { EpubGenerator } from '@/lib/epub';
import { downloadBlob, sanitizeFilename } from '@/utils';
import { fetchChaptersBatch } from '@/services';

export interface Progress {
  percent: number;
  title: string;
  detail: string;
}

export interface ExportOptions {
  splitVolumes: boolean;
}

export interface UseEpubExportResult {
  isExtracting: boolean;
  progress: Progress;
  handleExtract: (
    novelInfo: NovelInfo,
    selectedVolumes: Set<number>,
    options: ExportOptions
  ) => Promise<void>;
}

export function useEpubExport(): UseEpubExportResult {
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState<Progress>({
    percent: 0,
    title: '',
    detail: '',
  });

  const handleExtract = useCallback(
    async (
      novelInfo: NovelInfo,
      selectedVolumes: Set<number>,
      options: ExportOptions
    ) => {
      if (selectedVolumes.size === 0) {
        alert('Please select at least one volume.');
        return;
      }

      setIsExtracting(true);

      try {
        // Collect selected chapters
        const selectedChapters: (EpubChapter & { url: string })[] = [];

        novelInfo.volumes.forEach((volume, vIndex) => {
          if (selectedVolumes.has(vIndex)) {
            volume.chapters.forEach((chapter) => {
              selectedChapters.push({
                ...chapter,
                content: '',
                volumeIndex: vIndex,
                volumeTitle: volume.title,
                url: chapter.url,
              });
            });
          }
        });

        if (selectedChapters.length === 0) {
          throw new Error('No chapters selected.');
        }

        setProgress({
          percent: 0,
          title: 'Fetching chapters...',
          detail: `0/${selectedChapters.length}`,
        });

        // Fetch all chapters
        const batchRequest = selectedChapters.map((ch, i) => ({
          index: i,
          url: ch.url,
        }));
        const response = await fetchChaptersBatch(batchRequest);

        setProgress({
          percent: 70,
          title: 'Processing content...',
          detail: `${selectedChapters.length}/${selectedChapters.length}`,
        });

        // Map results back to chapters
        const chaptersContent: EpubChapter[] = response.results
          .filter((r) => r.content !== null)
          .map((r) => {
            const chapter = selectedChapters[r.index];
            return {
              ...chapter,
              content: r.content!.content,
            };
          });

        setProgress({
          percent: 85,
          title: 'Generating EPUB...',
          detail: '',
        });

        if (options.splitVolumes) {
          await generateSplitVolumes(novelInfo, chaptersContent, setProgress);
        } else {
          await generateSingleEpub(novelInfo, chaptersContent);
        }

        setProgress({
          percent: 100,
          title: 'Done!',
          detail: 'EPUB created successfully.',
        });
      } catch (error) {
        console.error('Extraction error:', error);
        setProgress({
          percent: 0,
          title: 'Error',
          detail: (error as Error).message,
        });
      } finally {
        setIsExtracting(false);
      }
    },
    []
  );

  return { isExtracting, progress, handleExtract };
}

/**
 * Generate a single EPUB with all chapters
 */
async function generateSingleEpub(
  novelInfo: NovelInfo,
  chapters: EpubChapter[]
): Promise<void> {
  const epub = new EpubGenerator({
    title: novelInfo.title,
    author: novelInfo.author,
    chapters,
  });

  const blob = await epub.generate();
  const filename = sanitizeFilename(novelInfo.title) + '.epub';
  downloadBlob(blob, filename);
}

/**
 * Generate separate EPUB for each volume
 */
async function generateSplitVolumes(
  novelInfo: NovelInfo,
  chapters: EpubChapter[],
  setProgress: (progress: Progress) => void
): Promise<void> {
  const volumeGroups: Record<
    number,
    { title: string; chapters: EpubChapter[] }
  > = {};

  chapters.forEach((ch) => {
    const vIndex = ch.volumeIndex!;
    if (!volumeGroups[vIndex]) {
      volumeGroups[vIndex] = { title: ch.volumeTitle!, chapters: [] };
    }
    volumeGroups[vIndex].chapters.push(ch);
  });

  const volumeIndexes = Object.keys(volumeGroups);

  for (let i = 0; i < volumeIndexes.length; i++) {
    const vIndex = parseInt(volumeIndexes[i]);
    const group = volumeGroups[vIndex];
    const volumePercent = 85 + ((i + 1) / volumeIndexes.length) * 15;

    setProgress({
      percent: volumePercent,
      title: 'Generating EPUB...',
      detail: `Volume: ${group.title}`,
    });

    const epub = new EpubGenerator({
      title: `${novelInfo.title} - ${group.title}`,
      author: novelInfo.author,
      chapters: group.chapters,
    });

    const blob = await epub.generate();
    const filename =
      sanitizeFilename(`${novelInfo.title} - ${group.title}`) + '.epub';
    downloadBlob(blob, filename);
  }
}
