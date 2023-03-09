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
import { PageRef } from '@/domain/product';

type ProductSubHeaderProps = {
  title: string;
  pages: ReadonlyArray<PageRef>;
};

const ProductSubHeader = (props: ProductSubHeaderProps) => {
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
          bgcolor: 'text.disabled', // Custom color for the whole container
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
              color: 'text.secondary',
              textDecoration: 'none',
            }}
          >
            {props.title}
          </Typography>
          <Box
            justifyContent='flex-end' // Elements within the box will be aligned to the right
            sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
          >
            {props.pages.map((page) => (
              <Button
                href={page.href}
                key={page.title}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: 'text.secondary', // Custom color for the button text
                  display: { xs: 'none', md: 'flex' },
                }}
              >
                {page.title}
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
              {props.pages.map((page) => (
                <MenuItem key={page.title} onClick={handleCloseNavMenu}>
                  <Typography textAlign='center' component='a' href={page.href}>
                    {page.title}
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

export default ProductSubHeader;
