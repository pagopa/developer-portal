import { WebinarCategory } from '@/lib/types/webinarCategory';
import { Stack, Typography } from '@mui/material';
import WebinarCategoryButton from '@/components/atoms/WebinarCategoryButton/WebinarCategoryButton';

type WebinarCategorySelectorProps = {
  selectedWebinarCategory: number;
  // eslint-disable-next-line functional/no-return-void
  setSelectedWebinarCategory: (selectedWebinarCategory: number) => void;
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
    <Stack
      component='section'
      spacing={'56px'}
      direction={'row'}
      sx={{
        backgroundColor: '#EBF4FD',
        minHeight: '112px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: { xs: '100%', md: '100%' },
        textAlign: 'center',
        width: '100%',
      }}
    >
      {webinarCategories.map((category, index) => (
        <WebinarCategoryButton
          key={index}
          onClick={() => {
            setSelectedWebinarCategory(index);
            return;
          }}
          isSelected={index === selectedWebinarCategory}
          label={category.name}
          icon={category.icon.data.attributes}
        ></WebinarCategoryButton>
      ))}
    </Stack>
  );
};

export default WebinarCategorySelector;
