import { Stack } from '@mui/material';
import { type CommonProps } from '../../types/components';
import { MenuDropdown, type MenuDropdownProp } from './MenuDropdown';

export interface NavigationProps extends CommonProps {
  menu: MenuDropdownProp[];
}

export const Navigation = ({ menu, theme }: NavigationProps) => (
  <Stack
    gap={{ md: 4, xs: 2 }}
    direction={{ md: 'row', xs: 'column' }}
    component='nav'
    aria-label='main'
  >
    {menu.map((menu, index) => (
      <MenuDropdown key={index} {...menu} theme={theme} />
    ))}
  </Stack>
);
