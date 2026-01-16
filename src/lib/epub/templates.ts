/**
 * EPUB XHTML Templates
 */

import { escapeXml } from '@/utils/sanitizer';
import type { EpubChapter } from './types';

/**
 * Generate META-INF/container.xml
 */
export function generateContainer(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
}

/**
 * Generate OEBPS/content.opf
 */
export function generateContentOpf(
  uuid: string,
  title: string,
  author: string,
  chapters: EpubChapter[]
): string {
  const now = new Date().toISOString();

  const manifest = chapters
    .map(
      (_, i) =>
        `    <item id="chapter${i}" href="chapter${i}.xhtml" media-type="application/xhtml+xml"/>`
    )
    .join('\n');

  const spine = chapters
    .map((_, i) => `    <itemref idref="chapter${i}"/>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="BookId">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="BookId">urn:uuid:${uuid}</dc:identifier>
    <dc:title>${escapeXml(title)}</dc:title>
    <dc:creator>${escapeXml(author)}</dc:creator>
    <dc:language>vi</dc:language>
    <meta property="dcterms:modified">${now.split('.')[0]}Z</meta>
  </metadata>
  <manifest>
${manifest}
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="css" href="style.css" media-type="text/css"/>
  </manifest>
  <spine toc="ncx">
${spine}
  </spine>
</package>`;
}

/**
 * Generate OEBPS/nav.xhtml (Table of Contents)
 */
export function generateNav(chapters: EpubChapter[]): string {
  const items = chapters
    .map(
      (ch, i) =>
        `      <li><a href="chapter${i}.xhtml">${escapeXml(ch.title)}</a></li>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <meta charset="utf-8" />
  <title>Table of Contents</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>Mục lục</h1>
    <ol>
${items}
    </ol>
  </nav>
</body>
</html>`;
}

/**
 * Generate OEBPS/toc.ncx (NCX Navigation)
 */
export function generateNcx(
  uuid: string,
  title: string,
  chapters: EpubChapter[]
): string {
  const navPoints = chapters
    .map(
      (ch, i) => `    <navPoint id="navPoint-${i + 1}" playOrder="${i + 1}">
      <navLabel><text>${escapeXml(ch.title)}</text></navLabel>
      <content src="chapter${i}.xhtml"/>
    </navPoint>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:${uuid}"/>
  </head>
  <docTitle><text>${escapeXml(title)}</text></docTitle>
  <navMap>
${navPoints}
  </navMap>
</ncx>`;
}

/**
 * Generate chapter XHTML file
 */
export function generateChapter(
  chapter: EpubChapter,
  sanitizedContent: string
): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <title>${escapeXml(chapter.title)}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <h1>${escapeXml(chapter.title)}</h1>
  <div class="chapter-content">
${sanitizedContent}
  </div>
</body>
</html>`;
}

/**
 * Generate OEBPS/style.css
 */
export function generateStyle(): string {
  return `body {
  font-family: Georgia, serif;
  font-size: 1em;
  line-height: 1.6;
  margin: 1em;
  color: #333;
}
h1 { font-size: 1.5em; margin-bottom: 1em; text-align: center; }
p { margin: 0.8em 0; text-indent: 1.5em; text-align: justify; }
.chapter-content { margin-top: 2em; }`;
}
