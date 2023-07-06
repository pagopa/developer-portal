import { ReactNode } from 'react';
import MUILink from '@mui/material/Link';
import NextLink from 'next/link';
import { convertLink, removeEmojis } from '@/markdoc/helpers';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';

type SummaryLinkProps = {
  title: string;
  href: string;
  children: ReactNode;
};

const SummaryLink = (prefix: string) => {
  const router = useRouter();

  return Object.assign(
    ({ title, href, children }: SummaryLinkProps) => {
      const isActive = router.asPath === convertLink(prefix, href);
      return (
        <MUILink
          component={NextLink}
          href={convertLink(prefix, href)}
          title={removeEmojis(title)}
          sx={{
            backgroundColor: isActive ? '#e6eef9' : 'transparent',
            borderRight: isActive ? '2px solid #0062C3' : 'none',
            textDecoration: 'none',
            padding: '16px 32px',
            width: '354px',
            flexGrow: 1,
            display: 'flex',
            verticalAlign: 'middle',
          }}
        >
          {typeof children === 'string' ? (
            <Typography
              component='span'
              sx={{
                color: '#17324D',
                fontSize: '18px',
                fontWeight: 600,
                overflow: 'hidden',
                textDecoration: 'none',
                textOverflow: 'ellipsis',
                textWrap: 'nowrap',
                whiteSpace: 'nowrap',
              }}
            >
              {removeEmojis(children)}
            </Typography>
          ) : (
            children
          )}
        </MUILink>
      );
    },
    { displayName: 'Link' }
  );
};

export default SummaryLink;
