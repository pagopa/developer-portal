import React from 'react';
import { Card, CardActionArea, CardContent } from '@mui/material';
import { ButtonNaked } from '@/editorialComponents/Footer/components/ButtonNaked';
import Link from 'next/link';

export type EmbedLinkProps = {
  url: string;
};

const EmbedLink = ({ url }: EmbedLinkProps) => {
  return (
    <Card variant='outlined'>
      <CardActionArea>
        <CardContent>
          <ButtonNaked
            color='primary'
            size='medium'
            href={url}
            component={Link}
          >
            {url}
          </ButtonNaked>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default EmbedLink;
