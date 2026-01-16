/**
 * Page type detection utilities for docln.net
 */

const DOCLN_DOMAINS = ['docln.net', 'docln.sbs'] as const;

/**
 * Check if URL belongs to docln
 */
export function isDocln(url: string): boolean {
  return DOCLN_DOMAINS.some((domain) => url.includes(domain));
}

/**
 * Check if current page is a novel info page
 */
export function isNovelPage(): boolean {
  const url = window.location.href;
  const isChapterUrl = /\/c\d+-/.test(url) || /\/t\d+-/.test(url);

  return (
    isDocln(url) &&
    (url.includes('/ai-dich/') || url.includes('/truyen/')) &&
    !isChapterUrl
  );
}

/**
 * Check if current page is a chapter page
 */
export function isChapterPage(): boolean {
  const url = window.location.href;
  return isDocln(url) && /\/c\d+-/.test(url);
}
