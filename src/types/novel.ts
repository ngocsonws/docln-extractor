/**
 * Novel-related type definitions
 */

export interface Chapter {
  index: number;
  title: string;
  url: string;
}

export interface Volume {
  index: number;
  title: string;
  chapters: Chapter[];
}

export interface NovelInfo {
  title: string;
  author: string;
  description: string;
  volumes: Volume[];
  totalChapters: number;
  url: string;
}

export interface ChapterContent {
  title: string;
  content: string;
}
