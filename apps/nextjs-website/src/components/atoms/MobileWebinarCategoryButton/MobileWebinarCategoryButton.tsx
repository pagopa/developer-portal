import { Box, Button, useTheme } from '@mui/material';
import IconWrapper from '@/components/atoms/IconWrapper/IconWrapper';
import { Media } from '@/lib/strapi/codecs/MediaCodec';
import React from 'react';

type MobileWebinarCategoryButtonProps = {
  // eslint-disable-next-line functional/no-return-void
  onClick: () => void;
  label: string;
  icon: Media;
  isHeader: boolean;
};

const MobileWebinarCategoryButton = ({
  onClick,
  icon,
  label,
  isHeader,
}: MobileWebinarCategoryButtonProps) => {
  const { palette } = useTheme();
  const height = isHeader ? 32 : 61;
  const paddingLeft = isHeader ? '8px' : '24px';
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
        sx={{
          justifyContent: 'flex-start',
          paddingLeft: paddingLeft,
          height: '100%',
          width: '100%',
          fontWeight: 700,
          color: palette.text.primary,
          borderRadius: '16px',
          backgroundColor: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#FAFAFA',
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
