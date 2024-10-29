'use client';
import React from 'react';
import { Icon, SxProps, Theme, Typography } from '@mui/material';
import Image from 'next/image';
import { ICON_MAP } from './IconMap';

export type IconWrapperProps = {
  icon: string;
  useSrc: boolean;
  color?: string;
  size?: number;
  sx?: SxProps<Theme>;
};

type IconName = keyof typeof ICON_MAP;

const IconWrapper = ({
  icon,
  useSrc,
  color = 'text.primary',
  size = 35,
  sx,
}: IconWrapperProps) => {
  if (useSrc) {
    return (
      <Icon sx={{ width: size, height: size, color, ...sx }}>
        <Image alt={icon} src={icon} height={size} width={size} />
      </Icon>
    );
  } else {
    const props = {
      color,
      sx: { width: size, height: size },
    };
    const Icon = icon && ICON_MAP[icon as IconName];
    return Icon ? (
      <Typography color={props?.color ?? 'inherit'}>
        <Icon {...props} color='inherit' sx={sx} />
      </Typography>
    ) : null;
  }
};

export default IconWrapper;
