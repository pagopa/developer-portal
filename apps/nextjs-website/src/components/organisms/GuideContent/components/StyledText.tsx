import Typography from '@mui/material/Typography';
import { StyledTextProps } from 'gitbook-docs/markdoc/schema/styledText';

const StyledText = ({ style, children }: StyledTextProps) => {
  switch (style) {
    case 'code':
      return (
        <Typography variant='monospaced' component='span'>
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
