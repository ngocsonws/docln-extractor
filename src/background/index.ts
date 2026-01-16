/**
 * Background Script Entry Point
 * Service worker for handling background operations
 */

import { fetchChapterContent, fetchChaptersBatch } from './services';
import type { BatchChapterRequest } from '@/types';

/**
 * Handle extension icon click - open new tab
 */
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id || !tab.url) return;

  // Get the extension's index.html URL
  const extensionUrl = chrome.runtime.getURL('index.html');

  // Pass the source tab info as URL params
  const params = new URLSearchParams({
    tabId: tab.id.toString(),
    url: tab.url,
  });

  // Open the extension UI in a new tab
  await chrome.tabs.create({
    url: `${extensionUrl}?${params.toString()}`,
  });
});

/**
 * Message handler for background script
 */
function handleMessage(
  request: { action: string; url?: string; chapters?: BatchChapterRequest[] },
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response: unknown) => void
): boolean {
  console.log('[Background] Received message:', request.action);

  switch (request.action) {
    case 'fetchChapter':
      if (request.url) {
        fetchChapterContent(request.url)
          .then((content) => sendResponse(content))
          .catch((error) => sendResponse({ error: error.message }));
      }
      return true;

    case 'fetchChaptersBatch':
      if (request.chapters) {
        fetchChaptersBatch(request.chapters)
          .then((results) => sendResponse({ results }))
          .catch((error) => sendResponse({ error: error.message }));
      }
      return true;

    default:
      return true;
  }
}

// Register message listener
chrome.runtime.onMessage.addListener(handleMessage);

console.log('[Docln to EPUB] Background service worker started');
