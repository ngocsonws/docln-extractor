/**
 * Chrome Extension message types
 */

export interface PageCheckResult {
  isNovelPage: boolean;
  isChapterPage: boolean;
  url: string;
}

// Message action types
export type MessageAction =
  | { action: 'checkPage' }
  | { action: 'getNovelInfo' }
  | { action: 'getChapterContent' }
  | { action: 'fetchChapter'; url: string }
  | { action: 'fetchChaptersBatch'; chapters: BatchChapterRequest[] };

// Background service types
export interface BatchChapterRequest {
  index: number;
  url: string;
}

export interface BatchChapterResult {
  index: number;
  content: import('./novel').ChapterContent | null;
  error?: string;
}

export interface BatchChapterResponse {
  results?: BatchChapterResult[];
  error?: string;
}
