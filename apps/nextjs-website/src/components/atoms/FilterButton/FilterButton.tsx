import { Box, Button, useTheme } from '@mui/material';
import IconWrapper from '@/components/atoms/IconWrapper/IconWrapper';
import React from 'react';
import { Media } from '@/lib/types/media';

type FilterButtonProps = {
  // eslint-disable-next-line functional/no-return-void
  onClick: () => void;
  isSelected: boolean;
  label: string;
  icon: Media;
};

const FilterButton = ({
  onClick,
  icon,
  isSelected,
  label,
}: FilterButtonProps) => {
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
          padding: '24px',
          lineHeight: '22px',
          letterSpacing: '0.3px',
          fontSize: '18px',
          borderRadius: '16px',
          height: '64px',
          fontWeight: 700,
          color: palette.text.primary,
          backgroundColor: isSelected ? palette.background.paper : '#EBF4FD',
          '&.MuiButton-contained:hover': {
            backgroundColor: '#D5E5F6',
          },
        }}
        onClick={onClick}
      >
        {label}
      </Button>
    </Box>
  );
};

export default FilterButton;
