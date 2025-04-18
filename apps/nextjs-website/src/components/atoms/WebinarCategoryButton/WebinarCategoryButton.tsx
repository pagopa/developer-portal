import { Box, Button, useTheme } from '@mui/material';
import IconWrapper from '@/components/atoms/IconWrapper/IconWrapper';
import { Media } from '@/lib/strapi/codecs/MediaCodec';
import React from 'react';

type WebinarCategoryButtonProps = {
  // eslint-disable-next-line functional/no-return-void
  onClick: () => void;
  isSelected: boolean;
  label: string;
  icon: Media;
};

const WebinarCategoryButton = ({
  onClick,
  icon,
  isSelected,
  label,
}: WebinarCategoryButtonProps) => {
  const { palette } = useTheme();
  return (
    <Box
      sx={{
        borderRadius: '16px',
        boxShadow: isSelected ? '0px 4px 9px 4px rgba(0, 43, 85, 0.1)' : 0,
      }}
    >
      <Button
        variant='contained'
        startIcon={<IconWrapper icon={icon.url} useSrc={true} size={32} />}
        sx={{
          borderRadius: '16px',
          height: '64px',
          fontWeight: 700,
          color: palette.text.primary,
          backgroundColor: isSelected ? palette.background.paper : '#EBF4FD',
        }}
      >
        {label}
      </Button>
    </Box>
  );
};

export default WebinarCategoryButton;
