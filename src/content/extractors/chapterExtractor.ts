/**
 * Chapter content extractor
 * Extracts content from chapter pages
 */

import { SELECTORS } from '@/types';
import { UNWANTED_SELECTORS } from '@/utils';
import type { ChapterContent } from '@/types';

/**
 * Remove unwanted elements from content
 */
function cleanupContent(element: HTMLElement): void {
  const selector = UNWANTED_SELECTORS.join(', ');
  element.querySelectorAll(selector).forEach((el) => el.remove());

  // Also remove all images
  element.querySelectorAll('img').forEach((el) => el.remove());
}

/**
 * Remove duplicate title from beginning of content
 */
function removeDuplicateTitle(element: HTMLElement, title: string): void {
  const firstChild = element.firstElementChild as HTMLElement;
  if (!firstChild || !title) return;

  const firstText = firstChild.textContent?.trim() || '';
  const titleMatches =
    firstText === title || (title.length > 20 && firstText.includes(title));

  if (titleMatches) {
    firstChild.remove();
  }
}

/**
 * Extract chapter content from the current page
 */
export function extractChapterContent(): ChapterContent {
  const result: ChapterContent = {
    title: '',
    content: '',
  };

  // Extract title
  const titleElem = document.querySelector<HTMLElement>(SELECTORS.chapterTitle);
  if (titleElem) {
    result.title = titleElem.textContent?.trim() || '';
  }

  // Extract content
  const contentElem = document.querySelector<HTMLElement>(
    SELECTORS.chapterContent
  );
  if (contentElem) {
    const clone = contentElem.cloneNode(true) as HTMLElement;

    cleanupContent(clone);
    removeDuplicateTitle(clone, result.title);
    result.content = clone.innerHTML.trim();
  }

  return result;
}
