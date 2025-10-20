import { Typography } from '@mui/material';
import GitBookContent from '@/components/organisms/GitBookContent/GitBookContent';
import { s3DocsPath, staticContentsUrl } from '@/config';

export type MarkdownPartProps = {
  readonly content: string;
  readonly dirName: string;
};
const MarkdownPart = ({ content, dirName }: MarkdownPartProps) => {
  if (content === null) {
    return <Typography />; // empty placeholder while loading
  }

  return (
    <GitBookContent
      content={content}
      config={{
        isPageIndex: false,
        pagePath: '',
        assetsPrefix: `${staticContentsUrl}/${s3DocsPath}/${dirName}`,
        urlReplaces: {},
        gitBookPagesWithTitle: [],
        spaceToPrefix: [],
      }}
      hideLevel1Headings={true}
    />
  );
};

export default MarkdownPart;
