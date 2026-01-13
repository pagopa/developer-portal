import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme, type SxProps } from '@mui/material/styles';
import { useCallback, useEffect, useState } from 'react';
import { type CommonProps } from '../types/components';
import { Ctas, type CtaProps } from '../Ctas/Ctas';
import { HamburgerMenu } from './components/HamburgerMenu';
import { type NavigationProps, Navigation } from './components/Navigation';
import { type TitleProps, Content } from './components/Title';
import { Divider } from '@mui/material';

interface BottomHeaderProps extends CtaProps, NavigationProps, TitleProps {}

export interface HeaderProps extends CommonProps, BottomHeaderProps {}

export const Header = (props: HeaderProps) => {
  const { product, theme, menu, ctaButtons, avatar, beta } = props;
  const [headerOpen, setHeaderOpen] = useState(false);

  const openHeader = () => {
    setHeaderOpen(true);
  };

  const closeHeader = () => {
    setHeaderOpen(false);
  };

  const onResize = useCallback(() => {
    closeHeader();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [onResize]);

  const { palette } = useTheme();
  const backgroundColor =
    theme === 'dark' ? palette.primary.dark : palette.background.paper;

  const HeaderCtas = () => <Ctas {...{ theme, ctaButtons }} />;

  return (
    <>
      <Box
        bgcolor={backgroundColor}
        component='header'
        role='banner'
        sx={{
          paddingX: {
            xs: 3,
            sm: 3,
          },
        }}
      >
        <Stack direction={{ md: 'row' }} paddingY={{ xs: 2, md: 1 }} gap={4}>
          <Stack sx={styles.headerInfo}>
            <Content {...{ product, avatar, beta, theme }} />
            <Stack
              sx={{ display: { md: 'none' } }}
              direction='row'
              alignItems='center'
              gap={4}
            >
              <Box sx={{ display: { xs: 'none', sm: 'block', md: 'none' } }}>
                <HeaderCtas />
              </Box>
              <HamburgerMenu
                onOpen={openHeader}
                onClose={closeHeader}
                open={headerOpen}
              />
            </Stack>
          </Stack>

          <Stack
            sx={{
              display: { xs: headerOpen ? 'flex' : 'none', md: 'flex' },
              ...styles.headerMenu,
            }}
          >
            <Navigation {...{ menu, theme }} />
            <Box
              sx={{
                display: { sm: 'none', md: 'block' },
              }}
            >
              <HeaderCtas />
            </Box>
          </Stack>
        </Stack>
      </Box>
      {!headerOpen && <Divider />}
    </>
  );
};

const styles: Record<string, SxProps> = {
  headerMenu: {
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: { md: 'center', xs: 'flex-start' },
    gap: { xs: 2 },
    px: 3,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};
