'use client';
import { CheckCircle } from '@mui/icons-material';
import { Grid, Typography, useTheme } from '@mui/material';

interface CheckItemProps {
  title: string;
  description: string;
}

const CheckItem = ({ title, description }: CheckItemProps) => {
  const { palette } = useTheme();

  return (
    <Grid container alignItems='flex-start' mb={4}>
      <Grid item xs={1} mr={3}>
        <CheckCircle sx={{ fontSize: 40, color: palette.info.extraLight }} />
      </Grid>
      <Grid item xs={10}>
        <Typography
          variant='overline'
          content='div'
          mb={2}
          color={palette.text.primary}
          fontSize={18}
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
