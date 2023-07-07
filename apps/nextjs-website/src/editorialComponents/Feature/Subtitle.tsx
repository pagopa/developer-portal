import { Link, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
export interface SubtitleProps {
  subtitle: string;
  textLink?: string;
  url?: string;
  theme: 'dark' | 'light';
}

const Subtitle = ({ subtitle, textLink, url, theme }: SubtitleProps) => {
  return (
    <Stack spacing={3} justifyContent='center' alignItems='center'>
      <Typography
        color={theme === 'light' ? 'text.primary' : 'background.paper'}
        variant='body2'
        textAlign='center'
      >
        {subtitle}
      </Typography>
      {textLink && (
        <Stack
          spacing={1}
          justifyContent='center'
          alignItems='center'
          direction='row'
          color={theme === 'light' ? 'primary' : 'background.paper'}
        >
          <Link
            color='inherit'
            href={url}
            underline='none'
            sx={{
              fontWeight: 'bold',
            }}
          >
            {textLink}
          </Link>

          <ArrowForwardIcon color='inherit' />
        </Stack>
      )}
    </Stack>
  );
};

export default Subtitle;
