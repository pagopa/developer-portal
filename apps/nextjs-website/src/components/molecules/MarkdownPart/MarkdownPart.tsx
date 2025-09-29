import GitBookContent from '@/components/organisms/GitBookContent/GitBookContent';
import { getMarkdownContent } from '@/lib/api';
import { Typography } from '@mui/material';

export type MarkdownPartProps = {
  readonly dirName: string;
  readonly pathToFile: string;
};

const MarkdownPart = ({ dirName, pathToFile }: MarkdownPartProps) => {
  console.log('rendering ', pathToFile, dirName);
  getMarkdownContent(dirName, pathToFile).then(
    (content) => {
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
        />
      );
    },
    (reason) => {
      console.log('issue was: ', reason);
      return <Typography></Typography>;
    }
  );
  return <Typography></Typography>; // Fetch or load the markdown content from dirName and pathToFile
};

export default MarkdownPart;
