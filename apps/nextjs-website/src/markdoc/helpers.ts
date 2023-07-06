export const convertLink = (prefix: string, href: string) => {
  if (!href.startsWith('http')) {
    const updated = href.replace('README.md', '').replace('.md', '');
    return `${prefix}/${updated}`.replace(new RegExp(`/$`), '');
  } else {
    return href;
  }
};

export const pairedHtmlTag = (tag: string) => ({
  // FIXME add a test and remove the useless escape char
  // eslint-disable-next-line no-useless-escape
  regex: new RegExp(`<${tag}([^>]*?)>(.*?)<\/${tag}>`, 'gs'),
  replace: `{% ${tag}$1 %}$2{% /${tag} %}`,
});
export const pairedHtmlTagCouple = (tag: string, innerTag: string) => ({
  // FIXME add a test and remove the useless escape char
  // eslint-disable-next-line no-useless-escape
  regex: new RegExp(
    `<${tag}([^>]*?)><${innerTag}([^>]*?)>(.*?)</${innerTag}></${tag}>`,
    'gs'
  ),
  replace: `$3`,
});
export const unpairedHtmlTag = (tag: string) => ({
  regex: new RegExp(`<${tag}(.*?)>`, 'g'),
  replace: `{% ${tag}$1 %}`,
});

export function removeEmojis(text: string): string {
  if (!text) {
    return '';
  }
  return text.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
    ''
  );
}
