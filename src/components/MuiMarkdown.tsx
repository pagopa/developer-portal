import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Image from 'next/image';

type MuiMarkdownProps = {
  body: string;
};

const MuiMarkdown = ({ body }: MuiMarkdownProps) => (
  <ReactMarkdown
    components={{
      h1({ node, className, children, ...props }) {
        return <Typography variant='h4'>{children}</Typography>;
      },
      h2({ node, className, children, ...props }) {
        return <Typography variant='h5'>{children}</Typography>;
      },
      h3({ node, className, children, ...props }) {
        return <Typography variant='h5'>{children}</Typography>;
      },
      h4({ node, className, children, ...props }) {
        return <Typography variant='h5'>{children}</Typography>;
      },
      h5({ node, className, children, ...props }) {
        return <Typography variant='h5'>{children}</Typography>;
      },
      h6({ node, className, children, ...props }) {
        return <Typography variant='h6'>{children}</Typography>;
      },
      p({ node, className, children, ...props }) {
        return <Typography variant='body2'>{children}</Typography>;
      },
      a({ node, className, children, ...props }) {
        return <Link {...props}>{children}</Link>;
      },
      li({ node, className, children, ...props }) {
        return (
          <Box component='li' mt={1}>
            <Typography variant='body2'>{children}</Typography>
          </Box>
        );
      },
      hr({ node, className, children, ...props }) {
        return <Divider />;
      },
      img({ node, className, alt, width, height, ...props }) {
        return (
          <Container maxWidth='sm'>
            <Box sx={{ height: '50vh' }} position='relative'>
              <Image alt={alt || 'empty'} src={props.src || ''} fill />
            </Box>
          </Container>
        );
      },
      blockquote({ node, className, children, ...props }) {
        return <blockquote>{children}</blockquote>;
      },
      code({ node, className, children, inline, ...props }) {
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
