import { WebinarCategory } from '@/lib/types/webinarCategory';
import { Box, Typography } from '@mui/material';

type WebinarCategorySelectorProps = {
  selectedWebinarCategory: WebinarCategory;
  setSelectedWebinarCategory: (
    selectedWebinarCategory: WebinarCategory
    // eslint-disable-next-line functional/no-return-void
  ) => void;
  webinarCategories: WebinarCategory[];
  isMobile: boolean;
};

const WebinarCategorySelector = ({
  selectedWebinarCategory,
  setSelectedWebinarCategory,
  webinarCategories,
  isMobile,
}: WebinarCategorySelectorProps) => {
  return (
    <Box
      component='section'
      sx={{
        backgroundColor: '#EBF4FD',
        direction: 'row',
        minHeight: '112px',
        display: 'flex',
        justifyContent: 'center',
        maxWidth: { xs: '100%', md: '100%' },
        textAlign: 'center',
        width: '100%',
      }}
    >
      {webinarCategories.map((category, index) => (
        <Typography key={index}>{category.name}</Typography>
      ))}
    </Box>
  );
};

export default WebinarCategorySelector;
