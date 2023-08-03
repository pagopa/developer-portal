import { ReactNode } from 'react';
import NextLink from 'next/link';
import { PageLinkProps } from 'gitbook-docs/markdoc/schema/pageLink';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export const PageLink = ({ url, children }: PageLinkProps<ReactNode>) => (
  <Card variant='outlined' sx={{ my: 2 }}>
    <CardActionArea component={NextLink} href={url}>
      <CardContent>
        <Typography variant={'body1'}> {children} </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

export default PageLink;
