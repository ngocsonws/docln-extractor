/**
 * Content Script Entry Point
 * Handles message communication with popup and background
 */

import { isNovelPage, isChapterPage } from './utils';
import {
  extractNovelInfo,
  expandAllChapters,
  extractChapterContent,
} from './extractors';
import type { PageCheckResult } from '@/types';

/**
 * Message handler for content script
 */
function handleMessage(
  request: { action: string },
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response: unknown) => void
): boolean {
  console.log('[Docln] Received message:', request.action);

  switch (request.action) {
    case 'checkPage':
      sendResponse({
        isNovelPage: isNovelPage(),
        isChapterPage: isChapterPage(),
        url: window.location.href,
      } as PageCheckResult);
      break;

    case 'getNovelInfo':
      expandAllChapters().then(() => {
        const info = extractNovelInfo();
        sendResponse(info);
      });
      return true; // Keep message channel open for async response

    case 'getChapterContent':
      sendResponse(extractChapterContent());
      break;

    default:
      sendResponse({ error: 'Unknown action' });
  }

  return true;
}

// Register message listener
chrome.runtime.onMessage.addListener(handleMessage);

console.log('[Docln to EPUB] Content script loaded on:', window.location.href);
