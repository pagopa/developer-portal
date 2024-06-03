'use client';
import React from 'react';
import { Icon, Typography } from '@mui/material';
import Image from 'next/image';
import { ICON_MAP } from './IconMap';

export type IconWrapperProps = {
  icon: string;
  isSvg?: boolean;
  color?: string;
  size?: number;
};

type IconName = keyof typeof ICON_MAP;

const IconWrapper = ({
  icon,
  isSvg = false,
  color = 'text.primary',
  size = 35,
}: IconWrapperProps) => {
  if (isSvg) {
    return (
      <Icon sx={{ width: size, height: size, color }}>
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
        <Icon {...props} color='inherit' />
      </Typography>
    ) : null;
  }
};

export default IconWrapper;
