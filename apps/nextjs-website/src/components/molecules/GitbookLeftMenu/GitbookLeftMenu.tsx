'use client';
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import { translations } from '@/_contents/translations';
import { renderGitBookMarkdown } from '@/markdoc';

type GitbookLeftMenuProps = {
  guideName: string;
  versionName: string;
  versions: {
    name: string;
    path: string;
  }[];
  menu: string;
  pathPrefix: string;
  assetsPrefix: string;
};

const GitbookLeftMenu = ({
  guideName,
  versionName,
  versions,
  menu,
  pathPrefix,
  assetsPrefix,
}: GitbookLeftMenuProps) => {
  const { palette } = useTheme();
  const { shared } = translations;

  return (
    <Box
      // bgcolor={palette.grey[50]}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '80px 0',
        flexBasis: { lg: '354px' },
        flexGrow: { lg: 0 },
        flexShrink: { lg: 0 },
      }}
    >
      <Typography
        variant='h6'
        sx={{
          padding: '16px 32px',
          verticalAlign: 'middle',
        }}
      >
        {guideName}
      </Typography>
      <Dropdown
        label={`${shared.version} ${versionName}`}
        items={versions.map((version) => ({
          href: version.path,
          label: version.name,
        }))}
        icons={{ opened: <ExpandLess />, closed: <ExpandMore /> }}
        buttonStyle={{
          color: palette.action.active,
          display: 'flex',
          justifyContent: 'space-between',
          padding: '16px 32px',
        }}
        menuStyle={{
          style: {
            width: '354px',
            maxWidth: '354px',
            left: 0,
            right: 0,
          },
        }}
        menuAnchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      />
      <Box
        sx={{
          margin: '32px 0 0 0',
        }}
      >
        {renderGitBookMarkdown(menu, pathPrefix, assetsPrefix, true)}
      </Box>
    </Box>
  );
};

export default GitbookLeftMenu;
