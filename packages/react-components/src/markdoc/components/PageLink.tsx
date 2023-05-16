import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import Link from 'next/link';
import { ReactNode } from 'react';

type PageLinkProps = {
  url: string;
  children: ReactNode;
};

const PageLink = ({ url, children }: PageLinkProps) => (
  <Card variant='outlined'>
    <CardActionArea component={Link} href={url}>
      <CardContent>
        <Typography variant={'body1'}> {children} </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

export default PageLink;
