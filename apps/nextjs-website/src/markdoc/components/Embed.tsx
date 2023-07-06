import { Card, CardActionArea, CardContent } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia/dist/components/ButtonNaked';
import Link from 'next/link';
import { ReactNode } from 'react';

type EmbedProps = {
  url: string;
  children: ReactNode;
};

const Embed = ({ url, children }: EmbedProps) => (
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
