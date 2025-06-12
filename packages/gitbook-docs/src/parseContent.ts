import Markdoc, { ConfigType, RenderableTreeNode } from '@markdoc/markdoc';
import { document } from './markdoc/schema/document';
import { hint } from './markdoc/schema/hint';
import { figure, img } from './markdoc/schema/image';
import {
  swagger,
  swaggerDescription,
  swaggerParameter,
  swaggerResponse,
} from './markdoc/schema/swagger';
import { paragraph } from './markdoc/schema/paragraph';
import { heading } from './markdoc/schema/heading';
import { link } from './markdoc/schema/link';
import { list } from './markdoc/schema/list';
import { item } from './markdoc/schema/item';
import { code, fence } from './markdoc/schema/code';
import { file } from './markdoc/schema/file';
import * as styled from './markdoc/schema/styledText';
import { blockquote } from './markdoc/schema/blockquote';
import { tabs } from './markdoc/schema/tabs';
import { details } from './markdoc/schema/details';
import { embed } from './markdoc/schema/embed';
import { br } from './markdoc/schema/br';
import { table } from './markdoc/schema/table';
import { pageLink } from './markdoc/schema/pageLink';
import { processHtmlTokens } from './markdoc/tokenProcessor';
import { PageTitlePath } from './parseDoc';
import { convertEmojiToUnicode } from './convertEmojiToUnicode';

export type ParseContentConfig = {
  readonly assetsPrefix: string;
  readonly pagePath: string;
  readonly isPageIndex: boolean;
  readonly gitBookPagesWithTitle: ReadonlyArray<PageTitlePath>;
  readonly spaceToPrefix: ReadonlyArray<{
    readonly spaceId: string;
    readonly pathPrefix: string;
  }>;
  readonly urlReplaces: { readonly [url: string]: string };
};

const pairedHtmlTag = (tag: string) => ({
  regex: new RegExp(`<${tag}([^>]*?)>(.*?)</${tag}>`, 'gs'),
  replace: `{% ${tag}$1 %}$2{% /${tag} %}`,
});
const unpairedHtmlTag = (tag: string) => ({
  regex: new RegExp(`(?<!<td>)<${tag}(.*?)>`, 'g'),
  replace: `{% ${tag}$1 / %}`,
});

const imgR = unpairedHtmlTag('img');
const figureR = pairedHtmlTag('figure');
const figcaptionR = pairedHtmlTag('figcaption');
const markR = pairedHtmlTag('mark');
const summaryR = pairedHtmlTag('summary');
const fileR = {
  regex: /({% file src="[^"]+" %}(?!.*{% \/file %}))/gis,
  replace: '$1\n{% /file %}',
};

const schema: ConfigType = {
  tags: {
    hint,
    img,
    figure,
    swagger,
    'swagger-description': swaggerDescription,
    'swagger-parameter': swaggerParameter,
    'swagger-response': swaggerResponse,
    code,
    embed,
    'figma-embed': embed,
    file,
    tabs,
    htmldetails: details,
    'content-ref': pageLink,
    htmlp: paragraph,
    htmlul: list,
    htmlol: list,
    htmlli: item,
    htmltable: table,
    htmla: link,
    htmlimg: img,
    htmlbr: br,
    htmlstrong: styled.strong,
  },
  nodes: {
    document,
    paragraph,
    heading: heading(true),
    image: img,
    link,
    list,
    item,
    fence,
    strong: styled.strong,
    em: styled.em,
    code: styled.code,
    s: styled.strikethrough,
    blockquote,
    table,
  },
};

export const parseAst = (markdown: string) => {
  // Workaround to convert from "GitBook Markdown" to "MarkDoc Markdown"
  // A better alternative could be to parse the html:
  // https://github.com/markdoc/markdoc/issues/10#issuecomment-1492560830
  // In this way many RegExp can be removed
  const markdoc = markdown
    .replaceAll('{% end', '\n{% /')
    .replaceAll(imgR.regex, imgR.replace)
    .replaceAll(figureR.regex, figureR.replace)
    .replaceAll(figcaptionR.regex, figcaptionR.replace)
    .replaceAll(markR.regex, markR.replace)
    .replaceAll(summaryR.regex, summaryR.replace)
    .replaceAll('{% @figma/embed', '{% figma-embed')
    .replaceAll(/:([a-z0-9_]+):/g, convertEmojiToUnicode);

  const updatedMarkdoc = markdoc
    .split('{% file')
    .map((part, i) => {
      if (i === 0) return part;
      const fullPart = '{% file' + part;
      return fullPart
        .replaceAll('{% endfile %}', '{% /file %}')
        .replaceAll(fileR.regex, fileR.replace);
    })
    .join('');

  const parsedMarkdoc = updatedMarkdoc
    .replaceAll(/\{%\s*include.*?%\}/g, '')
    .replaceAll('{% endinclude %}', '')
    .replaceAll(/^---\s*\n^title:\s*(.*?)\s*\n^---\s*$/gm, '');

  // Enable the parsing of html elements (e.g. <table>). During the parse phase
  // the html content is handled as a token of type html_block.
  const tokenizer = new Markdoc.Tokenizer({ html: true });
  // Given the html_block token parse its content and tokenize it. An html token
  // <div> is translated as a Markdoc tag with the name 'htmldiv'.
  const tokens = processHtmlTokens(tokenizer.tokenize(parsedMarkdoc));
  return Markdoc.parse([...tokens]);
};

export const parseContent = (
  markdown: string,
  config: ParseContentConfig
): ReadonlyArray<RenderableTreeNode> => {
  const ast = parseAst(markdown);
  return Markdoc.transform([ast], { ...schema, variables: config });
};
