import { CkEditorMenuItem } from '@/components/molecules/CkEditorPart/CkEditorPart';
import { generateIdFromString } from '@/helpers/anchor.helpers';

export function parseCkEditorContent(content: string): {
  readonly parsedContent: string;
  readonly menuItems: readonly CkEditorMenuItem[];
} {
  const menuItems: CkEditorMenuItem[] = [];

  // Use regex-based approach for server-side compatibility
  const headingRegex = /<(h[1-4])[^>]*>(.*?)<\/\1>/gi;
  let processedContent = content;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const [fullMatch, tag, textContent] = match;
    const level = parseInt(tag.replace('h', ''));
    const anchorId = generateIdFromString(`ckEditor-${textContent}`);

    // Create wrapped heading
    const wrapper = `<div id="${anchorId}" class="menuAnchor">${fullMatch}</div>`;

    // Replace in content
    processedContent = processedContent.replace(fullMatch, wrapper);

    // Add to menu items for h2, h3, h4
    if (level >= 2 && level <= 4) {
      // eslint-disable-next-line functional/immutable-data,functional/no-expression-statements
      menuItems.push({
        title: textContent.replace(/<[^>]*>/g, ''), // Strip HTML tags
        href: `#${anchorId}`,
        level: level,
      });
    }
  }

  // Simple sanitization without DOMPurify to avoid SSR issues
  let serializedContent = processedContent;

  // Basic sanitization - remove script tags and dangerous attributes
  serializedContent = serializedContent.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    '',
  );
  serializedContent = serializedContent.replace(/on\w+="[^"]*"/gi, '');
  serializedContent = serializedContent.replace(/javascript:/gi, '');

  return { parsedContent: serializedContent, menuItems };
}
