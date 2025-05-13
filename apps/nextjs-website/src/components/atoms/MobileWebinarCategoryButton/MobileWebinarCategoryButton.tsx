import { Box, Button, useTheme } from '@mui/material';
import IconWrapper from '@/components/atoms/IconWrapper/IconWrapper';
import { Media } from '@/lib/strapi/codecs/MediaCodec';
import React from 'react';

type MobileWebinarCategoryButtonProps = {
  // eslint-disable-next-line functional/no-return-void
  onClick: () => void;
  label: string;
  icon: Media;
  isHeader?: boolean;
  isLast?: boolean;
};

const MobileWebinarCategoryButton = ({
  onClick,
  icon,
  label,
  isHeader = false,
  isLast = false,
}: MobileWebinarCategoryButtonProps) => {
  const { palette } = useTheme();
  const height = isHeader ? 32 : 64;
  const paddingLeft = isHeader ? '16px' : '24px';
  return (
    <Box
      width={'100%'}
      height={height}
      alignItems={'center'}
      display={'flex'}
      justifyContent={'center'}
      sx={{
        borderRadius: '16px',
      }}
    >
      <Button
        startIcon={<IconWrapper icon={icon.url} useSrc={true} size={32} />}
        disabled={isHeader}
        sx={{
          justifyContent: 'flex-start',
          paddingLeft: paddingLeft,
          fontSize: '18px',
          height: '100%',
          width: '100%',
          fontWeight: 700,
          borderBottomLeftRadius: isLast ? '16px' : 0,
          borderBottomRightRadius: isLast ? '16px' : 0,
          color: palette.text.primary,
          backgroundColor: palette.background.paper,
          '&:hover': {
            backgroundColor: palette.grey[50],
          },
          '&:disabled': {
            fontWeight: 700,
            color: palette.text.primary,
            borderRadius: '16px',
            backgroundColor: palette.background.paper,
          },
        }}
        onClick={onClick}
      >
        {label}
      </Button>
    </Box>
  );
};

export default MobileWebinarCategoryButton;
