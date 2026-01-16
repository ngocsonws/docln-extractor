/**
 * Chapter Fetcher Service
 * Handles fetching chapter content by creating background tabs
 */

import type { ChapterContent } from '@/types';
import type { BatchChapterRequest, BatchChapterResult } from '@/types';

const CONCURRENCY_LIMIT = 5;
const TIMEOUT_MS = 30000;
const LOAD_DELAY_MS = 500;

/**
 * Execute content extraction script in a tab
 */
function createExtractionScript() {
  return () => {
    const result = {
      title: '',
      content: '',
    };

    const titleElem = document.querySelector<HTMLElement>('.chapter-title');
    if (titleElem) {
      result.title = titleElem.textContent?.trim() || '';
    }

    const contentElem = document.querySelector<HTMLElement>('#chapter-content');
    if (contentElem) {
      const clone = contentElem.cloneNode(true) as HTMLElement;

      // Clean up unwanted elements
      const unwantedSelectors = [
        'script',
        'style',
        'iframe',
        'img',
        '.ads',
        '.advertisement',
        '.chapter-banners',
        '[style*="display: none"]',
        '.d-none',
      ];
      clone
        .querySelectorAll(unwantedSelectors.join(', '))
        .forEach((el) => el.remove());

      // Check duplicate title at the beginning
      const firstChild = clone.firstElementChild as HTMLElement;
      if (firstChild) {
        const firstText = firstChild.textContent?.trim() || '';
        if (
          result.title &&
          (firstText === result.title ||
            (result.title.length > 20 && firstText.includes(result.title)))
        ) {
          firstChild.remove();
        }
      }

      result.content = clone.innerHTML.trim();
    }

    return result;
  };
}

/**
 * Fetch chapter content by creating a new tab
 */
export async function fetchChapterContent(
  url: string
): Promise<ChapterContent> {
  return new Promise((resolve, reject) => {
    chrome.tabs.create({ url, active: false }, (tab) => {
      const tabId = tab.id!;

      const listener = async (
        updatedTabId: number,
        changeInfo: { status?: string }
      ) => {
        if (updatedTabId === tabId && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);

          // Wait for content to fully render
          await new Promise((r) => setTimeout(r, LOAD_DELAY_MS));

          try {
            const [result] = await chrome.scripting.executeScript({
              target: { tabId },
              func: createExtractionScript(),
            });

            chrome.tabs.remove(tabId);
            resolve(result.result as ChapterContent);
          } catch (error) {
            chrome.tabs.remove(tabId);
            reject(error);
          }
        }
      };

      chrome.tabs.onUpdated.addListener(listener);

      // Timeout handler
      setTimeout(() => {
        chrome.tabs.onUpdated.removeListener(listener);
        chrome.tabs.remove(tabId).catch(() => {});
        reject(new Error('Timeout loading chapter'));
      }, TIMEOUT_MS);
    });
  });
}

/**
 * Fetch multiple chapters in parallel with concurrency limit
 */
export async function fetchChaptersBatch(
  chapters: BatchChapterRequest[],
  onProgress?: (completed: number, total: number) => void
): Promise<BatchChapterResult[]> {
  const results: BatchChapterResult[] = [];
  let completed = 0;
  const total = chapters.length;

  // Process in batches
  for (let i = 0; i < chapters.length; i += CONCURRENCY_LIMIT) {
    const batch = chapters.slice(i, i + CONCURRENCY_LIMIT);

    const batchPromises = batch.map(async (chapter) => {
      try {
        const content = await fetchChapterContent(chapter.url);
        return { index: chapter.index, content, error: undefined };
      } catch (error) {
        return {
          index: chapter.index,
          content: null,
          error: (error as Error).message,
        };
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    completed += batch.length;
    onProgress?.(completed, total);
  }

  // Sort by original index to maintain order
  return results.sort((a, b) => a.index - b.index);
}
