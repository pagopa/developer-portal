'use client';
import Check from '@mui/icons-material/Check';
import ContentCopy from '@mui/icons-material/ContentCopy';
import { IconButton, Tooltip } from '@mui/material';
import React, { useState } from 'react';

type CopyToClipboardProps = {
  readonly copiedTooltipLabel: string;
  readonly textToCopy: string;
  readonly copyColor?: string;
  readonly tooltipDuration?: number;
  readonly iconSize?: string;
};

const CopyToClipboard = ({
  copiedTooltipLabel,
  textToCopy,
  copyColor,
  tooltipDuration = 2000,
  iconSize = '24px',
}: CopyToClipboardProps) => {
  const [copied, setCopied] = useState(false);

  const onCopyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), tooltipDuration);
  };

  const size = {
    height: iconSize,
    width: iconSize,
  };

  return (
    <IconButton
      onClick={onCopyToClipboard}
      sx={{
        cursor: 'pointer',
      }}
    >
      {copied ? (
        <Tooltip
          sx={{
            display: 'block',
          }}
          open={true}
          placement='top'
          title={copiedTooltipLabel}
          arrow
        >
          <Check color='success' sx={size} />
        </Tooltip>
      ) : (
        <ContentCopy
          sx={{
            color: copyColor,
            ...size,
          }}
        />
      )}
    </IconButton>
  );
};

export default CopyToClipboard;
