export function extractTitleFromMarkdown(content: string): string | undefined {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    const title = titleMatch[1].trim();
    // Remove any emojis or special characters
    return title.replace(/[\u{1F600}-\u{1F6FF}]/gu, '');
  }
  return undefined;
}
