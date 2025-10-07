import { Typography } from '@mui/material';
import GitBookContent from '@/components/organisms/GitBookContent/components/GitBookContent';

export type MarkdownPartProps = {
  readonly content: string;
};
const MarkdownPart = ({ content }: MarkdownPartProps) => {
  if (content == null) {
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
      hideH1={true}
    />
  );
};

export default MarkdownPart;
