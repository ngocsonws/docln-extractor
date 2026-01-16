/**
 * Chrome messaging service
 * Wraps Chrome extension APIs for easier use
 */

import type {
  NovelInfo,
  ChapterContent,
  PageCheckResult,
  BatchChapterRequest,
  BatchChapterResult,
} from '@/types';

/**
 * Get the current active tab
 */
export async function getCurrentTab(): Promise<chrome.tabs.Tab | null> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab || null;
}

/**
 * Check if URL is a docln domain
 */
export function isDocLnUrl(url: string | undefined): boolean {
  return !!url && (url.includes('docln.net') || url.includes('docln.sbs'));
}

/**
 * Send message to content script
 */
export function sendToContentScript<T>(
  tabId: number,
  action: string
): Promise<T> {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, { action }, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response as T);
      }
    });
  });
}

/**
 * Send message to background script
 */
export function sendToBackground<T>(
  message: Record<string, unknown>
): Promise<T> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (response?.error) {
        reject(new Error(response.error));
      } else {
        resolve(response as T);
      }
    });
  });
}

/**
 * Check current page type
 */
export async function checkPage(tabId: number): Promise<PageCheckResult> {
  return sendToContentScript<PageCheckResult>(tabId, 'checkPage');
}

/**
 * Get novel info from current page
 */
export async function getNovelInfo(tabId: number): Promise<NovelInfo> {
  return sendToContentScript<NovelInfo>(tabId, 'getNovelInfo');
}

/**
 * Get chapter content from current page
 */
export async function getChapterContent(
  tabId: number
): Promise<ChapterContent> {
  return sendToContentScript<ChapterContent>(tabId, 'getChapterContent');
}

/**
 * Fetch chapters in batch via background script
 */
export async function fetchChaptersBatch(
  chapters: BatchChapterRequest[]
): Promise<{ results: BatchChapterResult[] }> {
  return sendToBackground<{ results: BatchChapterResult[] }>({
    action: 'fetchChaptersBatch',
    chapters,
  });
}

/**
 * Get URL parameters (for when opened as new tab)
 */
export function getUrlParams(): { tabId: number | null; url: string | null } {
  const params = new URLSearchParams(window.location.search);
  const tabId = params.get('tabId');
  const url = params.get('url');
  return {
    tabId: tabId ? parseInt(tabId) : null,
    url,
  };
}
