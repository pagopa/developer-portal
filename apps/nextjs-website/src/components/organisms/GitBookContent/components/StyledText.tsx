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
        <Typography variant='body1' fontWeight='bold' component='span'>
          {children}
        </Typography>
      );
    case 'italic':
      return (
        <Typography variant='body1' fontStyle='italic' component='span'>
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
