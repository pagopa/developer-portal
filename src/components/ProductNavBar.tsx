import * as React from 'react';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu as MUIMenu,
  Container,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Menu } from '@/domain/navigator';
import { useRouter } from 'next/router';
import { pipe } from 'fp-ts/lib/function';
import Link from 'next/link';

export type ProductNavBarProps = {
  title: string;
  navLinks: Menu;
};

const ProductNavBar = (props: ProductNavBarProps) => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const [value, setValue] = React.useState(useRouter().asPath);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <AppBar position='static'>
      <Container
        maxWidth={false}
        sx={{
          bgcolor: 'white', // Custom color for the whole container
        }}
      >
        <Toolbar disableGutters>
          <Typography
            variant='h6'
            noWrap
            component={Link}
            href='/'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              color: 'text.primary',
              textDecoration: 'none',
            }}
          >
            {props.title}
          </Typography>
          <Box
            justifyContent='flex-end'
            sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
          >
            <Tabs value={value} onChange={handleChange}>
              {pipe(
                props.navLinks,
                RA.map((link) => (
                  <Tab
                    component={Link}
                    href={link.path}
                    value={link.path}
                    label={
                      <Typography variant='sidenav' color='primary.main'>
                        {link.name}
                      </Typography>
                    }
                    key={link.path}
                    sx={{
                      my: 2,
                    }}
                  />
                ))
              )}
            </Tabs>
          </Box>
          {
            // Mobile rendering
          }
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
            <MUIMenu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {props.navLinks.map((link) => (
                <MenuItem key={link.name} onClick={handleCloseNavMenu}>
                  <Typography
                    textAlign='center'
                    component={Link}
                    href={link.path}
                  >
                    {link.name}
                  </Typography>
                </MenuItem>
              ))}
            </MUIMenu>
          </Box>
          <Typography
            variant='h5'
            noWrap
            component={Link}
            href=''
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {props.title}
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ProductNavBar;
