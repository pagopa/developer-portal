import FeedbackIcon from '@mui/icons-material/Feedback';
import { Button } from '@mui/material';

interface GuideFeedbackLinkProps {
  readonly label: string;
  readonly href?: string;
}

const GuideFeedbackLink = ({ label, href }: GuideFeedbackLinkProps) => {
  return (
    <Button
      component={href ? 'a' : 'button'}
      href={href}
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
      type={href ? undefined : 'button'}
      variant='text'
      startIcon={<FeedbackIcon />}
      sx={{
        width: { xs: '185px', lg: '192px' },
        height: { xs: '32px', lg: '48px' },
        padding: '0 12px',
        flexShrink: 0,
        backgroundColor: 'grey.100',
        color: 'primary.main',
        borderRadius: { xs: '0 0 0 16px', lg: '0 0 0 18px' },
        fontSize: { xs: '14px', lg: '16px' },
        fontWeight: 600,
        whiteSpace: 'nowrap',
        '& .MuiButton-startIcon': {
          marginLeft: 0,
          marginRight: '8px',
          '& > :nth-of-type(1)': {
            fontSize: { xs: '16px', lg: '24px' },
          },
        },
        '&.MuiButton-text:hover': { backgroundColor: 'grey.200' },
        '&.Mui-focusVisible': { outlineOffset: '-2px' },
      }}
    >
      {label}
    </Button>
  );
};

export default GuideFeedbackLink;
