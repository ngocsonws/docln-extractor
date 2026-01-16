/**
 * HTML Sanitizer utilities for EPUB content
 */

import DOMPurify from 'dompurify';

/**
 * Escape XML special characters
 */
export function escapeXml(str: string): string {
  if (!str) return '';
  return str.replace(/[<>&'"]/g, (char) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      "'": '&apos;',
      '"': '&quot;',
    };
    return entities[char] || char;
  });
}

/**
 * Sanitize HTML content for EPUB format
 * Uses DOMPurify for safe parsing, then normalizes structure
 */
export function sanitizeHtml(html: string): string {
  // First pass: DOMPurify to remove dangerous content
  const purified = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'div', 'span', 'b', 'i', 'em', 'strong'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });

  // Second pass: normalize structure for EPUB
  let cleaned = purified
    // Convert div/span to p
    .replace(/<div\b[^>]*>/gi, '<p>')
    .replace(/<\/div>/gi, '</p>')
    .replace(/<span\b[^>]*>/gi, '')
    .replace(/<\/span>/gi, '')
    // Normalize br
    .replace(/<br\s*\/?>/gi, '<br/>')
    // Remove inline styles
    .replace(/<(p|b|i|em|strong)\s+[^>]*>/gi, '<$1>')
    // Clean up empty paragraphs
    .replace(/<p>\s*<\/p>/gi, '')
    // Remove multiple whitespace
    .replace(/\n{2,}/g, '\n')
    .replace(/\s{2,}/g, ' ')
    .trim();

  // Wrap content in paragraph if needed
  if (!cleaned.startsWith('<p>') && cleaned.length > 0) {
    cleaned = '<p>' + cleaned;
  }
  if (!cleaned.endsWith('</p>') && cleaned.length > 0) {
    cleaned = cleaned + '</p>';
  }

  return cleaned;
}

/**
 * Unwanted element selectors for content cleaning
 */
export const UNWANTED_SELECTORS = [
  'script',
  'style',
  'iframe',
  '.ads',
  '.advertisement',
  '.chapter-banners',
  '[style*="display: none"]',
  '.d-none',
] as const;
