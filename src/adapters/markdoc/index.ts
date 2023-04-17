import Markdoc, { RenderableTreeNode } from '@markdoc/markdoc';
import { config } from './schema';
import React from 'react';
import { components } from './components';

const pairedHtmlTag = (tag: string) => ({
  regex: new RegExp(`<${tag}([^>]*?)>(.*?)<\/${tag}>`, 'gs'),
  replace: `{% ${tag}$1 %}$2{% /${tag} %}`,
});
const unpairedHtmlTag = (tag: string) => ({
  regex: new RegExp(`<${tag}(.*?)>`, 'g'),
  replace: `{% ${tag}$1 %}`,
});

const imgR = unpairedHtmlTag('img');
const markR = pairedHtmlTag('mark');
const detailsR = pairedHtmlTag('details');
const summaryR = pairedHtmlTag('summary');
const figureR = pairedHtmlTag('figure');
const figcaptionR = pairedHtmlTag('figcaption');
const tableR = pairedHtmlTag('table');
const theadR = pairedHtmlTag('thead');
const tbodyR = pairedHtmlTag('tbody');
const thR = pairedHtmlTag('th');
const trR = pairedHtmlTag('tr');
const tdR = pairedHtmlTag('td');

export const transform = (markdown: string): RenderableTreeNode => {
  // Ugly workaround to convert from "GitBook Markdown" to "MarkDoc Markdown"
  const manipulated = markdown
    .replaceAll('{% end', '{% /')
    .replaceAll(imgR.regex, imgR.replace)
    .replaceAll(markR.regex, markR.replace)
    .replaceAll(detailsR.regex, detailsR.replace)
    .replaceAll(summaryR.regex, summaryR.replace)
    .replaceAll(figureR.regex, figureR.replace)
    .replaceAll(figcaptionR.regex, figcaptionR.replace)
    .replaceAll(tableR.regex, tableR.replace)
    .replaceAll(theadR.regex, theadR.replace)
    .replaceAll(tbodyR.regex, tbodyR.replace)
    .replaceAll(thR.regex, thR.replace)
    .replaceAll(trR.regex, trR.replace)
    .replaceAll(tdR.regex, tdR.replace);
  const ast = Markdoc.parse(manipulated);
  return Markdoc.transform(ast, config);
};

export const renderGitBookMarkdown = (markdown: string): React.ReactNode =>
  Markdoc.renderers.react(transform(markdown), React, { components });
