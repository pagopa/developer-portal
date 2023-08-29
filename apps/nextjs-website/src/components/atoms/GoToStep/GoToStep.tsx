import React, { createElement } from 'react';
import Typography from '@mui/material/Typography';
import { Box, useTheme } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { translations } from '@/_contents/translations';

type GoToStepProps = {
  previousOrNext: 'previous' | 'next';
  title: string;
};

const GoToStep = ({ previousOrNext, title }: GoToStepProps) => {
  const { palette } = useTheme();

  const arrowIcon = createElement(
    previousOrNext === 'next' ? ArrowForward : ArrowBack,
    { sx: { color: palette.text.secondary, height: '24px', width: '24px' } }
  );
  const { quickStartGuide } = translations;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: previousOrNext === 'next' ? 1 : 0,
        paddingRight: previousOrNext === 'next' ? 0 : 1,
      }}
    >
      <Typography
        color='text.secondary'
        fontSize={14}
        fontWeight={400}
        marginBottom='4px'
        sx={{ display: { xs: 'none', md: 'block' } }}
      >
        {previousOrNext === 'next'
          ? quickStartGuide.content.next
          : quickStartGuide.content.previous}
      </Typography>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: previousOrNext === 'next' ? 'row' : 'row-reverse',
          gap: '15px',
        }}
      >
        <Typography
          color='text.secondary'
          fontSize={18}
          fontWeight={600}
          sx={{ display: { xs: 'none', md: 'block' } }}
        >
          {title}
        </Typography>
        {arrowIcon}
      </Box>
    </Box>
  );
};

export default GoToStep;
