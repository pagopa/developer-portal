import { WebinarCategory } from '@/lib/types/webinarCategory';
import { Stack } from '@mui/material';
import WebinarCategoryButton from '@/components/atoms/WebinarCategoryButton/WebinarCategoryButton';

type DesktopWebinarCategorySelectorProps = {
  selectedWebinarCategory: number;
  // eslint-disable-next-line functional/no-return-void
  setSelectedWebinarCategory: (selectedWebinarCategory: number) => void;
  webinarCategories: WebinarCategory[];
};

const DesktopWebinarCategorySelector = ({
  selectedWebinarCategory,
  setSelectedWebinarCategory,
  webinarCategories,
}: DesktopWebinarCategorySelectorProps) => {
  return (
    <Stack
      component='section'
      spacing={{ md: '32px', sm: '16px' }}
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

export default DesktopWebinarCategorySelector;
