/**
 * Central export point for all types
 */

// Novel types
export type { Chapter, Volume, NovelInfo, ChapterContent } from './novel';

// Chrome types
export type {
  PageCheckResult,
  MessageAction,
  BatchChapterRequest,
  BatchChapterResult,
  BatchChapterResponse,
} from './chrome';

// Selectors
export { SELECTORS } from './selectors';
export type { SelectorKey } from './selectors';
