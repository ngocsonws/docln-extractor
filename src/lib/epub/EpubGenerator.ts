/**
 * EPUB Generator Class
 * Creates EPUB files from chapter content
 */

import JSZip from 'jszip';
import { generateUUID, sanitizeHtml } from '@/utils';
import {
  generateContainer,
  generateContentOpf,
  generateNav,
  generateNcx,
  generateChapter,
  generateStyle,
} from './templates';
import type { EpubOptions, EpubChapter } from './types';

export class EpubGenerator {
  private title: string;
  private author: string;
  private chapters: EpubChapter[];
  private uuid: string;
  private encoder: TextEncoder;

  constructor(options: EpubOptions) {
    this.title = options.title || 'Untitled';
    this.author = options.author || 'Unknown';
    this.chapters = options.chapters || [];
    this.uuid = generateUUID();
    this.encoder = new TextEncoder();
  }

  /**
   * Encode string to UTF-8 bytes
   */
  private encode(str: string): Uint8Array {
    return this.encoder.encode(str);
  }

  /**
   * Generate the EPUB file as a Blob
   */
  async generate(): Promise<Blob> {
    const zip = new JSZip();

    // Mimetype must be first and uncompressed
    zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

    // META-INF
    zip
      .folder('META-INF')!
      .file('container.xml', this.encode(generateContainer()));

    // OEBPS
    const oebps = zip.folder('OEBPS')!;
    oebps.file(
      'content.opf',
      this.encode(
        generateContentOpf(this.uuid, this.title, this.author, this.chapters)
      )
    );
    oebps.file('nav.xhtml', this.encode(generateNav(this.chapters)));
    oebps.file(
      'toc.ncx',
      this.encode(generateNcx(this.uuid, this.title, this.chapters))
    );
    oebps.file('style.css', this.encode(generateStyle()));

    // Chapter files
    this.chapters.forEach((chapter, index) => {
      const sanitizedContent = sanitizeHtml(chapter.content);
      oebps.file(
        `chapter${index}.xhtml`,
        this.encode(generateChapter(chapter, sanitizedContent))
      );
    });

    return await zip.generateAsync({
      type: 'blob',
      mimeType: 'application/epub+zip',
    });
  }
}
