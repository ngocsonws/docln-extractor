/**
 * Download helper utility
 * Handles blob downloads without opening new tabs
 */

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  // Revoke URL after a short delay to ensure download starts
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Sanitize filename by removing invalid characters
 */
export function sanitizeFilename(name: string): string {
  return name.replace(/[<>:"/\\|?*]/g, '_');
}
