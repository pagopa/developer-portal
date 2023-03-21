import * as React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ProductNavigation } from '@/domain/product';

export type ProductNavBarProps = {
  title: string;
  navLinks: ProductNavigation;
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
            component='a'
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
            justifyContent='flex-end' // Elements within the box will be aligned to the right
            sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
          >
            {props.navLinks.map((link) => (
              <Button
                href={link.path}
                key={link.label}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: 'primary.main', // Custom color for the button text
                  display: { xs: 'none', md: 'flex' },
                }}
              >
                {link.label}
              </Button>
            ))}
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
            <Menu
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
                <MenuItem key={link.label} onClick={handleCloseNavMenu}>
                  <Typography textAlign='center' component='a' href={link.path}>
                    {link.label}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant='h5'
            noWrap
            component='a'
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
