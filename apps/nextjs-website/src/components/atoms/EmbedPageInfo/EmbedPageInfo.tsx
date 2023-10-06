import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@mui/material';
import { ButtonNaked } from '@/editorialComponents/Footer/components/ButtonNaked';
import Link from 'next/link';
import Image from 'next/image';

export type EmbedPageInfoProps = {
  url: string;
};

const EmbedPageInfo = ({ url }: EmbedPageInfoProps) => {
  const [pageTitle, setPageTitle] = useState<string>('');
  const [siteName, setSiteName] = useState<string>('');
  const [favicon, setFavicon] = useState<string>('');

  useEffect(() => {
    async function fetchPageInfo() {
      // Fetch the URL to get the page's HTML
      const html = await fetch(url)
        .then((res) => res.text())
        .catch((error) => console.error('Error fetching data:', error));

      // Extract the page title
      const titleMatch = html?.match(/<title>(.*?)<\/title>/i);
      if (titleMatch) {
        setPageTitle(titleMatch[1]);
      }

      // Extract the og:site_name meta tag
      const ogSiteNameMatch = html?.match(
        /<meta.*?property="og:site_name".*?content="(.*?)".*?>/i
      );
      if (ogSiteNameMatch) {
        setSiteName(ogSiteNameMatch[1]);
      }

      // Extract the favicon
      const faviconMatch = html?.match(
        /<link.*?rel="icon".*?href="(.*?)".*?>/i
      );
      if (faviconMatch) {
        setFavicon(faviconMatch[1]);
      }
    }

    if (url) {
      fetchPageInfo();
    }
  }, [url]);

  return (
    <Card variant='outlined'>
      <CardActionArea>
        <CardContent>
          <ButtonNaked color='text' size='medium' href={url} component={Link}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {favicon && (
                <Box>
                  <Image src={favicon} alt='Favicon' width='32' height='32' />
                </Box>
              )}
              <Box>
                <Typography variant='body1' fontWeight={700} gutterBottom>
                  {pageTitle}
                </Typography>
                <Typography variant='body2'>{siteName}</Typography>
              </Box>
            </Box>
          </ButtonNaked>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default EmbedPageInfo;
