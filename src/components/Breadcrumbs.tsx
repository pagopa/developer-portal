import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from '@mui/material';

const Breadcrumbs = () => (
  <div role='presentation' onClick={() => {}}>
    <MUIBreadcrumbs aria-label='breadcrumb'>
      <Link underline='hover' color='inherit' href='/'>
        MUI
      </Link>
      <Link
        underline='hover'
        color='inherit'
        href='/material-ui/getting-started/installation/'
      >
        Core
      </Link>
      <Typography color='text.primary'>Breadcrumbs</Typography>
    </MUIBreadcrumbs>
  </div>
);

export default Breadcrumbs;
