import { FC } from 'react';
import Link from 'next/link';
import { Typography, useTheme } from '@mui/material';

export type LinkButtonProps = {
  readonly href: string;
  readonly icon?: string;
  readonly title: string;
};

export const LinkButton: FC<LinkButtonProps> = ({
  href = '',
  title = '',
}: LinkButtonProps) => {
  const { palette } = useTheme();

  return (
    <Link href={href}>
      <Typography
        variant='subtitle2'
        color={palette.primary['light']}
        sx={{ textDecoration: 'none' }}
      >
        {title}
      </Typography>
    </Link>
  );
};
