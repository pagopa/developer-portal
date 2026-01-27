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
import Link from 'next/link';
import React, { ReactNode } from 'react';
import Tag from '@/components/atoms/Tag/Tag';

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
  readonly labels?: { readonly label: string; readonly path?: string }[];
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
  labels,
  variant = 'h3',
}: CtaCardProps) => {
  return (
    <Card
      sx={{
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'space-between',
        minHeight: { xs: 'auto', lg: '330px' },
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
              marginTop: 2,
            }}
            variant={variant}
            gutterBottom
          >
            {title}
          </Typography>
          {text && <Typography variant='body2'>{text}</Typography>}
          <Box flexGrow={1} />
          {labels && labels.length > 0 && (
            <Box mt={1} mr={1} mb={-1}>
              {labels.map((label) => (
                <Box
                  key={label.label}
                  sx={{
                    display: 'inline',
                    marginRight: 1,
                    '& > span': { marginBottom: 1 },
                  }}
                >
                  <Tag
                    label={label.label}
                    sx={{
                      paddingY: 0.2,
                      maxHeight: 'auto',
                      maxWidth: 'auto',
                      marginBottom: 1,
                    }}
                  />
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
