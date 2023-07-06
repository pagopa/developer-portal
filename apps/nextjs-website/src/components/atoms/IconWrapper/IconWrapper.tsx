import React from 'react';
import * as Icons from '@mui/icons-material';
import { EIcon } from '@pagopa/pagopa-editorial-components/dist/components/EIcon';
import { Icon } from '@mui/material';
import Image from 'next/image';

type IconWrapperProps = {
  icon: string;
  isSvg?: boolean;
  color?: string;
  size?: number;
};

type IconName = keyof typeof Icons;

const IconWrapper = ({
  icon,
  isSvg = false,
  color = 'primary.main',
  size = 40,
}: IconWrapperProps) => {
  if (isSvg) {
    return (
      <Icon sx={{ width: size, height: size }}>
        <Image alt={icon} src={icon} height={size} width={size} />
      </Icon>
    );
  } else {
    const props = {
      color,
      sx: { width: size, height: size },
    };
    return <EIcon icon={icon as IconName} {...props} />;
  }
};

export default IconWrapper;
