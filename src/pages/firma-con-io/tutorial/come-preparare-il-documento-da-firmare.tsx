import { staticNav } from '@/adapters/static/staticNav';
import { ioSignTutorial } from '@/adapters/static/staticProduct';
import Breadcrumbs from '@/components/Breadcrumbs';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { makeBreadcrumbs } from '@/domain/navigator';
import { ProductTutorial } from '@/domain/product';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Image from 'next/image';

export const getStaticProps: GetStaticProps<ProductTutorial> = () => ({
  props: ioSignTutorial,
});

const Tutorial = (props: ProductTutorial) => {
  const breadcrumbs = makeBreadcrumbs(staticNav, useRouter().pathname);
  return (
    <Box>
      <Stack>
        <Header />
        <Box bgcolor='background.paper'>
          <Container maxWidth='xl'>
            <Breadcrumbs items={breadcrumbs} />
          </Container>
        </Box>
        <Container maxWidth='xl'>
          <Stack spacing={4}>
            <ReactMarkdown
              components={{
                h1({ node, className, children, ...props }) {
                  return (
                    <Typography variant='h1' {...props}>
                      {children}
                    </Typography>
                  );
                },
                h2({ node, className, children, ...props }) {
                  return (
                    <Typography variant='h2' {...props}>
                      {children}
                    </Typography>
                  );
                },
                h3({ node, className, children, ...props }) {
                  return (
                    <Typography variant='h3' {...props}>
                      {children}
                    </Typography>
                  );
                },
                h4({ node, className, children, ...props }) {
                  return (
                    <Typography variant='h4' {...props}>
                      {children}
                    </Typography>
                  );
                },
                h5({ node, className, children, ...props }) {
                  return (
                    <Typography variant='h5' {...props}>
                      {children}
                    </Typography>
                  );
                },
                h6({ node, className, children, ...props }) {
                  return (
                    <Typography variant='h6' {...props}>
                      {children}
                    </Typography>
                  );
                },
                p({ node, className, children, ...props }) {
                  return (
                    <Typography variant='body2' {...props}>
                      {children}
                    </Typography>
                  );
                },
                a({ node, className, children, ...props }) {
                  return <Link {...props}>{children}</Link>;
                },
                li({ node, className, children, ...props }) {
                  return (
                    <Box component='li' mt={1} {...props}>
                      <Typography variant='body2' {...props}>
                        {children}
                      </Typography>
                    </Box>
                  );
                },
                hr({ node, className, children, ...props }) {
                  return <Divider />;
                },
                img({ node, className, alt, width, height, ...props }) {
                  return (
                    <Image alt={alt || 'empty'} src={props.src || ''} fill />
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
                      <Typography
                        variant='monospaced'
                        color={'primary.contrastText'}
                      >
                        {children}
                      </Typography>
                    </Paper>
                  );
                },
              }}
            >
              {props.body}
            </ReactMarkdown>
          </Stack>
        </Container>
        <Footer />
      </Stack>
    </Box>
  );
};

export default Tutorial;
