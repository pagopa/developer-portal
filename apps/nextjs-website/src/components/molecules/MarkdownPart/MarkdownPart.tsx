import GitBookContent from '@/components/organisms/GitBookContent/GitBookContent';
import { Typography } from '@mui/material';

export type MarkdownPartProps = {
  readonly content: string;
};
const MarkdownPart = ({ content }: MarkdownPartProps) => {
  if (content === null) {
    return <Typography />; // empty placeholder while loading
  }

  return (
    <GitBookContent
      content={content}
      config={{
        isPageIndex: false,
        pagePath: '',
        assetsPrefix: '',
        urlReplaces: {},
        gitBookPagesWithTitle: [],
        spaceToPrefix: [],
      }}
      hideLevel1Headings={true}
    />
  );
};

export default MarkdownPart;
