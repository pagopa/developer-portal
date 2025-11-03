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
            color: palette.grey[800],
            paddingY: 0,
            paddingX: '4px',
            backgroundColor: palette.background.default,
            fontWeight: 600,
            borderRadius: '5px',
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
          sx={{ fontSize: 'inherit' }}
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
          sx={{ fontSize: 'inherit' }}
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
