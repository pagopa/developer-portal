import Button, { type ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { type Generic, type CommonProps } from '../types/components';
import { isJSX } from '../utils';

export interface CtaButtonProps extends Partial<ButtonProps> {
  text: string;
}

export type CtaButton = CtaButtonProps | Generic;

export interface CtaProps extends CommonProps {
  ctaButtons?: CtaButton[];
  reverse?: boolean;
}

export const Ctas = ({ ctaButtons, theme, reverse }: CtaProps) => {
  const buttonsThemeDefault: ButtonProps[] = [
    {
      color: theme === 'dark' ? 'error' : 'primary',
      variant: 'contained',
    },
    {
      color: theme === 'dark' ? 'error' : 'primary',
      variant: 'outlined',
    },
  ];

  return ctaButtons?.length ? (
    <Stack
      display='flex'
      direction={reverse ? 'row-reverse' : 'row'}
      justifyContent='left'
      spacing={2}
    >
      {ctaButtons.map((button: CtaButton, i) => {
        return isJSX(button) ? (
          button
        ) : (
          <Button
            sx={{ width: { md: 'auto', xs: '100%' }, display: 'flex' }}
            key={`${button.text}-${i}`}
            {...buttonsThemeDefault[i]}
            {...button}
          >
            {button.text}
          </Button>
        );
      })}
    </Stack>
  ) : null;
};
