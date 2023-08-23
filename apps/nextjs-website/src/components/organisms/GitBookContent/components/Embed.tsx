import { Card, CardActionArea, CardContent } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia/dist/components/ButtonNaked';
import { EmbedProps } from 'gitbook-docs/markdoc/schema/embed';
import Link from 'next/link';
import { ReactNode } from 'react';

const Embed = ({ url, children }: EmbedProps<ReactNode>) => (
  <Card variant='outlined'>
    <CardActionArea>
      <CardContent>
        <ButtonNaked color='text' size='medium' href={url} component={Link}>
          {children}
        </ButtonNaked>
      </CardContent>
    </CardActionArea>
  </Card>
);

export default Embed;
