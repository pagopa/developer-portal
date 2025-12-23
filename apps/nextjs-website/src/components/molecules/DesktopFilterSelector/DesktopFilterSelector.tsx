import { Stack } from '@mui/material';
import FilterButton from '@/components/atoms/FilterButton/FilterButton';
import { Media } from '@/lib/types/media';

type DesktopFilterSelectorProps = {
  selectedFilter: number;
  // eslint-disable-next-line functional/no-return-void
  setSelectedFilter: (selectedFilter: number) => void;
  selectorFilters: readonly {
    name: string;
    icon: Media;
  }[];
};

const DesktopFilterSelector = ({
  selectedFilter,
  setSelectedFilter,
  selectorFilters,
}: DesktopFilterSelectorProps) => {
  return (
    <Stack
      id={'filters'}
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
      {selectorFilters.map((category, index) => (
        <FilterButton
          key={index}
          onClick={() => {
            setSelectedFilter(index);
            return;
          }}
          isSelected={index === selectedFilter}
          label={category.name}
          icon={category.icon}
        ></FilterButton>
      ))}
    </Stack>
  );
};

export default DesktopFilterSelector;
