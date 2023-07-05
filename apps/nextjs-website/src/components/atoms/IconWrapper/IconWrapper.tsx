import React from 'react';
import { Icon } from '@mui/material';
import Image from 'next/image';
import {
  Feedback,
  FlagOutlined,
  FolderOutlined,
  HeadsetMic,
} from '@mui/icons-material';

const getIconFromName = (iconName: string) => {
  switch (iconName) {
    case 'HeadsetMic':
      return <HeadsetMic />;
    case 'Feedback':
      return <Feedback />;
    case 'FlagOutlined':
      return <FlagOutlined />;
    case 'FolderOutlined':
      return <FolderOutlined />;
    default:
      return <></>;
  }
};

type IconWrapperProps = {
  icon: string;
  isSvg?: boolean;
  color?: string;
  size?: number;
};

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
    const muiIcon = React.cloneElement(getIconFromName(icon), {
      sx: { color: color, width: size, height: size },
    });
    return muiIcon;
  }
};

export default IconWrapper;
