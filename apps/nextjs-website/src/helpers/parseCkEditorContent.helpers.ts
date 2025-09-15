import { CkEditorHtmlMenuItem } from '@/components/molecules/CkEditorHtmlPart/CkEditorHtmlPart';
import { JSDOM } from 'jsdom';
import { generateIdFromString } from '@/helpers/anchor.helpers';
import DOMPurify from 'isomorphic-dompurify';

export function parseCkEditorHtmlContent(content: string): {
  readonly parsedContent: string;
  readonly menuItems: readonly CkEditorHtmlMenuItem[];
} {
  // eslint-disable-next-line
  const menuItems: CkEditorHtmlMenuItem[] = [];
  const dom = new JSDOM(content);

  // eslint-disable-next-line functional/no-expression-statements
  dom.window.document.querySelectorAll('h1, h2, h3, h4').forEach((element) => {
    const wrapper = dom.window.document.createElement('div');
    // eslint-disable-next-line functional/immutable-data,functional/no-expression-statements
    wrapper.id = generateIdFromString(`ckEditor-${element.textContent ?? ''}`);
    // eslint-disable-next-line functional/immutable-data,functional/no-expression-statements
    wrapper.className = 'menuAnchor';
    const cloned = element.cloneNode(true);
    // eslint-disable-next-line functional/no-expression-statements
    wrapper.appendChild(cloned);
    // eslint-disable-next-line functional/no-expression-statements
    element.parentNode?.replaceChild(wrapper, element);
    if (['h2', 'h3', 'h4'].includes(element.tagName.toLowerCase())) {
      // eslint-disable-next-line functional/immutable-data,functional/no-expression-statements
      menuItems.push({
        title: cloned.textContent ?? '',
        href: `#${wrapper.id}`,
        level: parseInt(element.tagName.toLowerCase().replace('h', '')),
      });
    }
  });
  const serializedContent = DOMPurify.sanitize(dom.serialize());

  return { parsedContent: serializedContent, menuItems };
}
