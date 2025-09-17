import React, { ReactNode } from 'react';
import { useTheme } from '@mui/material';

type TabProps = {
  children: ReactNode;
  hidden: boolean;
};

const Tab = ({ children, hidden }: TabProps) => {
  const { palette } = useTheme();

  return (
    <div
      hidden={hidden}
      style={{
        border: `1px solid ${palette.divider}`,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
        borderBottomLeftRadius: 4,
        padding: 16,
      }}
    >
      {children}
    </div>
  );
};

export default Tab;
