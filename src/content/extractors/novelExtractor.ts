/**
 * Novel information extractor
 * Extracts all novel metadata from the novel info page
 */

import { SELECTORS } from '@/types';
import type { NovelInfo, Volume, Chapter } from '@/types';

/**
 * Click all "See More" buttons to expand hidden chapters
 */
export async function expandAllChapters(): Promise<void> {
  const seeMoreButtons = document.querySelectorAll<HTMLElement>(
    SELECTORS.seeMoreButton
  );

  for (const button of seeMoreButtons) {
    if (button.offsetParent !== null) {
      button.click();
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  // Wait for content to load
  await new Promise((resolve) => setTimeout(resolve, 500));
}

/**
 * Extract novel title
 */
function extractTitle(): string {
  const titleElem = document.querySelector<HTMLElement>(SELECTORS.novelTitle);
  return titleElem?.textContent?.trim() || '';
}

/**
 * Extract author name from info items
 */
function extractAuthor(): string {
  const infoItems = document.querySelectorAll<HTMLElement>(SELECTORS.novelInfo);

  for (const item of infoItems) {
    const nameElem = item.querySelector<HTMLElement>('.info-name');
    const valueElem = item.querySelector<HTMLElement>('.info-value');

    if (nameElem && valueElem) {
      const name = nameElem.textContent?.trim() || '';
      if (name.includes('Tác giả')) {
        return valueElem.textContent?.trim() || '';
      }
    }
  }

  return '';
}

/**
 * Extract chapters from a volume section
 */
function extractChaptersFromVolume(section: HTMLElement): Chapter[] {
  const chapters: Chapter[] = [];
  const chapterLinks = section.querySelectorAll<HTMLAnchorElement>(
    SELECTORS.chapterLink
  );

  chapterLinks.forEach((link, index) => {
    chapters.push({
      index,
      title: link.textContent?.trim() || '',
      url: link.href,
    });
  });

  return chapters;
}

/**
 * Extract all volumes with their chapters
 */
function extractVolumes(): { volumes: Volume[]; totalChapters: number } {
  const volumes: Volume[] = [];
  let totalChapters = 0;

  const volumeSections = document.querySelectorAll<HTMLElement>(
    SELECTORS.volumeList
  );

  volumeSections.forEach((section, index) => {
    const titleElem = section.querySelector<HTMLElement>(SELECTORS.volumeTitle);
    const chapters = extractChaptersFromVolume(section);

    volumes.push({
      index,
      title: titleElem?.textContent?.trim() || '',
      chapters,
    });

    totalChapters += chapters.length;
  });

  return { volumes, totalChapters };
}

/**
 * Extract complete novel information from the page
 */
export function extractNovelInfo(): NovelInfo {
  const { volumes, totalChapters } = extractVolumes();

  return {
    title: extractTitle(),
    author: extractAuthor(),
    description: '',
    volumes,
    totalChapters,
    url: window.location.href,
  };
}
