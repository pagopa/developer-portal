import Markdoc, { RenderableTreeNode } from '@markdoc/markdoc';
import { config } from './schema';
import React from 'react';
import { components } from './components';
import {
  pairedHtmlTag,
  pairedHtmlTagCouple,
  selfClosingTag,
  unpairedHtmlTag,
} from '@/markdoc/helpers';

const fileR = selfClosingTag('file');
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
const pStrongR = pairedHtmlTagCouple('p', 'strong');
const pR = pairedHtmlTag('p');

export const transform = (markdown: string): RenderableTreeNode => {
  // TODO: Ugly workaround to convert from "GitBook Markdown" to "MarkDoc Markdown"
  // The html tag into the markdown can be parsed as following:
  // https://github.com/markdoc/markdoc/issues/10#issuecomment-1492560830
  // In this way many RegExp can be removed
  const manipulated = markdown
    .replaceAll('{% end', '{% /')
    .replaceAll(fileR.regex, fileR.replace)
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
    .replaceAll(tdR.regex, tdR.replace)
    .replaceAll(pStrongR.regex, pStrongR.replace)
    .replaceAll(pR.regex, pR.replace);
  const ast = Markdoc.parse(manipulated);
  return Markdoc.transform(ast, config);
};

export const renderGitBookMarkdown = (
  markdown: string,
  pathPrefix: string,
  assetsPrefix: string,
  isSummary = false
): React.ReactNode => {
  return Markdoc.renderers.react(transform(markdown), React, {
    components: isSummary
      ? components(pathPrefix, assetsPrefix, isSummary)
      : components(pathPrefix, assetsPrefix),
  });
};
