'use client';
import { CheckCircle } from '@mui/icons-material';
import { Box, Chip, Grid, Typography, useTheme } from '@mui/material';
import { useTranslations } from 'next-intl';

interface CheckItemProps {
  title: string;
  description: string;
  isComingSoon: boolean;
}

const CheckItem = ({ title, description, isComingSoon }: CheckItemProps) => {
  const shared = useTranslations('shared');
  const { palette } = useTheme();

  return (
    <Grid container alignItems='flex-start' mb={4}>
      <Grid item xs={1} mr={3}>
        <CheckCircle sx={{ fontSize: 40, color: palette.info.light }} />
      </Grid>
      <Grid item xs={10}>
        <Box>
          {isComingSoon && (
            <Chip
              label={shared('comingSoon')}
              size='small'
              sx={{
                color: palette.text.secondary,
                backgroundColor: palette.grey[200],
              }}
            />
          )}
        </Box>
        <Typography
          variant='overline'
          content='div'
          mb={2}
          color={palette.text.primary}
          fontSize={18}
          fontWeight={600}
          letterSpacing={'normal'}
          sx={{ textTransform: 'none' }}
        >
          {title}
        </Typography>
        <Typography content='div'>{description}</Typography>
      </Grid>
    </Grid>
  );
};

export default CheckItem;
