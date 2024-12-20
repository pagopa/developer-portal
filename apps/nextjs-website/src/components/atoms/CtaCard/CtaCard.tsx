'use client';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  styled,
  SxProps,
  Typography,
} from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import { Tag } from '@pagopa/mui-italia';
import Link from 'next/link';
import React, { ReactNode } from 'react';

export type CtaCardProps = {
  readonly title: string;
  readonly titleStyle?: SxProps;
  readonly text?: string;
  readonly minHeight?: number;
  readonly cta?: {
    readonly target?: '_blank' | '_self' | '_parent' | '_top';
    readonly label: string | ReactNode;
    readonly href?: string;
    readonly variant?: 'text' | 'contained' | 'outlined';
  };
  readonly comingSoon?: boolean;
  readonly icon?: ReactNode;
  readonly children?: ReactNode | ReactNode[];
  readonly tags?: { readonly label: string; readonly path?: string }[];
  readonly variant?: Variant;
};

const StyledCardContent = styled(CardContent)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const CtaCard = ({
  title,
  titleStyle,
  text,
  minHeight,
  cta,
  comingSoon = false,
  icon,
  children,
  tags,
  variant = 'h3',
}: CtaCardProps) => {
  return (
    <Card
      style={{
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'space-between',
        height: '100%',
        boxShadow: '0px 8px 18px 7px rgba(0, 43, 85, 0.1)',
      }}
    >
      <div style={{ opacity: comingSoon ? 0.5 : 1, flexGrow: 1 }}>
        {children && <CardMedia>{children}</CardMedia>}
        <StyledCardContent
          sx={{ minHeight: minHeight || 'auto', height: '100%' }}
        >
          {icon}
          <Typography
            sx={{
              ...titleStyle,
              fontSize: '1.5rem !important',
              lineHeight: '1.15 !important',
            }}
            mt={2}
            variant={variant}
            gutterBottom
          >
            {title}
          </Typography>
          {text && <Typography variant='body2'>{text}</Typography>}
          <Box flexGrow={1} />
          {tags && tags.length > 0 && (
            <Box mt={1} mr={1} mb={-1}>
              {tags.map((tag) => (
                <Box
                  key={tag.label}
                  sx={{
                    display: 'inline',
                    marginRight: 1,
                    '& > span': { marginBottom: 1 },
                  }}
                >
                  <Tag value={tag.label} color='primary' variant='light' />
                </Box>
              ))}
            </Box>
          )}
        </StyledCardContent>
      </div>
      <CardActions style={{ bottom: 0 }}>
        {cta && (
          <Link href={cta.href || '#'} target={cta.target || '_self'}>
            <Button
              disabled={comingSoon}
              variant={cta.variant || 'contained'}
              size='small'
            >
              {cta.label}
            </Button>
          </Link>
        )}
      </CardActions>
    </Card>
  );
};

export default CtaCard;
