import React from 'react';
import * as Icons from '@mui/icons-material';
import { EIcon } from '@pagopa/pagopa-editorial-components/dist/components/EIcon';

type IconWrapperProps = {
  iconName: string;
  color?: string;
  size?: number;
};

type IconName = keyof typeof Icons;

const IconWrapper = ({
  iconName,
  color = 'primary',
  size = 40,
}: IconWrapperProps) => {
  const props = {
    color,
    sx: { width: size, height: size },
  };
  return <EIcon icon={iconName as IconName} {...props}></EIcon>;
};

export default IconWrapper;
