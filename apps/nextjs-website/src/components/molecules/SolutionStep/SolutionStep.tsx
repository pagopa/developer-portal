import { Stack, Typography, Box, Chip } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

type SolutionStepProps = {
  title: string;
  content: string;
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
        <Typography variant='body1'>{content}</Typography>
      </Stack>
      <Stack gap={2}>
        <Typography
          color={(theme) => theme.palette.action.active}
          sx={{ textTransform: 'uppercase' }}
          variant='subtitle2'
        >
          {t('steps.platforms')}
        </Typography>
        <Box display='flex' gap={1}>
          {products.map((product, index) => (
            <Link key={index} href={product.href}>
              <Chip
                label={product.label}
                variant='filled'
                sx={{
                  color: '#215C76',
                  background: '#E1F5FE',
                  borderRadius: 1,
                }}
              />
            </Link>
          ))}
        </Box>
      </Stack>
    </Stack>
  );
};

export default SolutionStep;
