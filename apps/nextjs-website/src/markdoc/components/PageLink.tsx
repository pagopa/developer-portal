import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import Link from 'next/link';
import { ReactNode } from 'react';
import { convertLink } from '../helpers';

type PageLinkProps = {
  url: string;
  children: ReactNode;
};

const PageLink = (prefix: string) =>
  Object.assign(
    ({ url, children }: PageLinkProps) => (
      <Card variant='outlined'>
        <CardActionArea component={Link} href={convertLink(prefix, url)}>
          <CardContent>
            <Typography variant={'body1'}> {children} </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    ),
    { displayName: 'PageLink' }
  );

export default PageLink;
