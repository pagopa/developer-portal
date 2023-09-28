import { useTheme } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { type CommonProps } from '../types/components';

export interface BannerLinkContentProps extends CommonProps {
  title: string;
  body: string | JSX.Element;
}

export const Content = ({ title, body, theme }: BannerLinkContentProps) => {
  const { palette, spacing } = useTheme();
  const textColor =
    theme === 'dark' ? palette.primary.contrastText : palette.text.primary;

  return (
    <Stack textAlign='center' gap={spacing(2)}>
      <Typography color={textColor} variant='h6'>
        {title}
      </Typography>
      <Typography color={textColor} variant='body2'>
        {body}
      </Typography>
    </Stack>
  );
};
