import { Stack, Typography, Box } from '@mui/material';
import { Tag } from '@pagopa/mui-italia';
import { BlocksContent } from '@strapi/blocks-react-renderer';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import BlocksRendererClient from '../BlocksRendererClient/BlocksRendererClient';

type SolutionStepProps = {
  title: string;
  content: BlocksContent;
  products: { label: string; href: string }[];
};

const SolutionStep = ({ title, content, products }: SolutionStepProps) => {
  const t = useTranslations('solution');
  return (
    <Stack flexBasis={{ lg: '334px' }} gap={2} justifyContent='space-between'>
      <Stack gap={2}>
        <Typography
          color={(theme) => theme.palette.action.active}
          sx={{ fontWeight: 700 }}
          variant='caption'
        >
          {title}
        </Typography>
        <BlocksRendererClient content={content} />
      </Stack>
      <Stack gap={2}>
        <Typography
          color={(theme) => theme.palette.action.active}
          sx={{ textTransform: 'uppercase', fontWeight: 700 }}
          variant='subtitle2'
        >
          {t('steps.platforms')}
        </Typography>
        <Box display='flex' gap={1}>
          {products.map((product, index) => (
            <Link key={index} href={product.href}>
              <Tag value={product.label} color='primary' variant='light' />
            </Link>
          ))}
        </Box>
      </Stack>
    </Stack>
  );
};

export default SolutionStep;
