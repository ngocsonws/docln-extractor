/**
 * DOM Selectors for docln.net structure
 */

export const SELECTORS = {
  // Novel info page
  novelTitle: '.series-name a',
  novelInfo: '.info-item',
  volumeList: 'section.volume-list',
  volumeTitle: '.sect-title',
  chapterLink: '.chapter-name a',
  seeMoreButton: '.see-more',

  // Chapter page
  chapterTitle: '.chapter-title',
  chapterContent: '#chapter-content',
} as const;

export type SelectorKey = keyof typeof SELECTORS;
