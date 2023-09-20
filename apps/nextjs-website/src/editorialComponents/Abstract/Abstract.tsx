'use client';
// TODO: Remove when @pagopa/pagopa-editorial-components Abstract component will be ready
import { Box, Stack, SxProps, Typography, useTheme } from '@mui/material';
import { Generic } from '@pagopa/pagopa-editorial-components/dist/types/components';
import EContainer from '@pagopa/pagopa-editorial-components/dist/components/EContainer';

export interface AbstractProps {
  overline: string;
  title: string;
  description: string | Generic;
  background?: string | Generic;
  layout?: 'left' | 'center' | 'right';
  containerStyle?: SxProps;
  stackStyle?: SxProps;
}

export const Abstract: React.FC<AbstractProps> = ({
  overline,
  title,
  description,
  background,
  layout = 'left',
  containerStyle,
  stackStyle,
}) => {
  const { palette } = useTheme();
  const theme = palette.mode;
  const textColor = theme === 'dark' ? 'background.paper' : 'text.primary';

  const overlay =
    theme === 'dark'
      ? 'linear-gradient(76.77deg, rgba(0, 115, 230, 0.7) 40.28%, rgba(0, 115, 230, 0) 100%), '
      : 'linear-gradient(0deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), ';

  const backgroundColor =
    theme === 'dark' ? 'primary.dark' : 'background.paper';
  const eyeletColor = theme === 'dark' ? 'background.paper' : 'text.secondary';

  const BackgroundImage = (
    <Box
      // https://www.w3.org/WAI/tutorials/images/decorative/#example-1-image-used-as-part-of-page-design
      role='presentation'
      sx={{
        px: { xs: 4 },
        position: 'absolute',
        inset: 0,
        zIndex: -10,
        height: '100%',
        width: '100%',
        objectFit: 'cover',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundImage: `${overlay}url(${background ?? ''})`,
      }}
    />
  );

  const { spacing } = useTheme();

  const flexLayoutMap = {
    center: 'center',
    right: 'flex-end',
    left: 'flex-start',
  };

  return (
    <EContainer
      background={!background ? backgroundColor : BackgroundImage}
      sx={containerStyle}
    >
      <Stack
        sx={
          stackStyle || {
            paddingY: { xs: spacing(5), md: spacing(10) },
            paddingX: 0,
          }
        }
        width='100%'
        justifyContent='center'
        alignItems={flexLayoutMap[layout]}
      >
        <Box
          display='flex'
          flexDirection='column'
          maxWidth={spacing(70)}
          textAlign={layout}
          color={textColor}
          gap={spacing(2)}
        >
          <Typography color={eyeletColor} variant={'overline'}>
            {overline}
          </Typography>
          <Typography color={textColor} variant='h4'>
            {title}
          </Typography>
          <Typography
            component={typeof description === 'string' ? 'p' : 'div'}
            color={textColor}
            variant='body1'
          >
            {description}
          </Typography>
        </Box>
      </Stack>
    </EContainer>
  );
};
