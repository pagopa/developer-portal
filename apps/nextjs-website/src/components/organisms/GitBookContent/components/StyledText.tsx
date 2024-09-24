import Typography from '@mui/material/Typography';
import { StyledTextProps } from 'gitbook-docs/markdoc/schema/styledText';
import { useTheme } from '@mui/material';

const StyledText = ({ style, children }: StyledTextProps) => {
  const { palette } = useTheme();

  switch (style) {
    case 'code':
      return (
        <Typography
          variant='monospaced'
          component='span'
          sx={{
            paddingY: 0.5,
            paddingX: 1,
            backgroundColor: palette.background.default,
          }}
        >
          {children}
        </Typography>
      );
    case 'strong':
      return (
        <Typography
          variant='body1'
          fontWeight='bold'
          component='span'
          sx={{ fontSize: '16px' }}
        >
          {children}
        </Typography>
      );
    case 'italic':
      return (
        <Typography
          variant='body1'
          fontStyle='italic'
          component='span'
          sx={{ my: 2, fontSize: '16px', fontWeight: 400, lineHeight: '24px' }}
        >
          {children}
        </Typography>
      );
    default:
      return (
        <Typography variant='body1' component='span'>
          {children}
        </Typography>
      );
  }
};

export default StyledText;
