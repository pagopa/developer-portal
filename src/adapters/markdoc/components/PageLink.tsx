import { Card, CardActionArea, CardContent } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia/dist/components/ButtonNaked';
import Link from 'next/link';
import { ReactNode } from 'react';

type PageLinkProps = {
  url: string;
  children: ReactNode;
};

const PageLink = ({ url, children }: PageLinkProps) => (
  <Card variant='outlined'>
    <CardActionArea>
      <CardContent>
        <ButtonNaked
          color='text'
          onFocusVisible={function noRefCheck() {}}
          size='medium'
          href={url}
          component={Link}
        >
          {children}
        </ButtonNaked>
      </CardContent>
    </CardActionArea>
  </Card>
);

export default PageLink;
