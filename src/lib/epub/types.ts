/**
 * EPUB Generator Types
 */

export interface EpubChapter {
  title: string;
  content: string;
  volumeIndex?: number;
  volumeTitle?: string;
}

export interface EpubOptions {
  title: string;
  author: string;
  chapters: EpubChapter[];
}
