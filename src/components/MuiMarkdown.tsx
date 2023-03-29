import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import MUILink from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Image from 'next/image';
import Link from 'next/link';

type MuiMarkdownProps = {
  body: string;
};

const MuiMarkdown = ({ body }: MuiMarkdownProps) => (
  <ReactMarkdown
    components={{
      h1({ children }) {
        return <Typography variant='h4'>{children}</Typography>;
      },
      h2({ children }) {
        return <Typography variant='h5'>{children}</Typography>;
      },
      h3({ children }) {
        return <Typography variant='h5'>{children}</Typography>;
      },
      h4({ children }) {
        return <Typography variant='h5'>{children}</Typography>;
      },
      h5({ children }) {
        return <Typography variant='h5'>{children}</Typography>;
      },
      h6({ children }) {
        return <Typography variant='h6'>{children}</Typography>;
      },
      p({ children }) {
        return <Typography variant='body2'>{children}</Typography>;
      },
      a({ children, href }) {
        return <MUILink component={Link} href={href}>{children}</MUILink>;
      },
      li({ children }) {
        return (
          <Box component='li' mt={1}>
            <Typography variant='body2'>{children}</Typography>
          </Box>
        );
      },
      hr() {
        return <Divider />;
      },
      img({ alt, src }) {
        return (
          <Container maxWidth='sm'>
            <Box sx={{ height: '50vh' }} position='relative'>
              <Image alt={alt || 'empty'} src={src || ''} fill />
            </Box>
          </Container>
        );
      },
      blockquote({ children }) {
        return <blockquote>{children}</blockquote>;
      },
      code({ children, inline }) {
        return inline ? (
          <Typography variant='monospaced'>{children}</Typography>
        ) : (
          <Paper
            variant='outlined'
            sx={{
              backgroundColor: 'background.code',
              height: '100%',
              p: 3,
            }}
          >
            <Typography variant='monospaced' color={'primary.contrastText'}>
              {children}
            </Typography>
          </Paper>
        );
      },
    }}
  >
    {body}
  </ReactMarkdown>
);

export default MuiMarkdown;
