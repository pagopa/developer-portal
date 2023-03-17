import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from '@mui/material';

const Breadcrumbs = () => (
  <div role='presentation' onClick={() => {}}>
    <MUIBreadcrumbs aria-label='breadcrumb'>
      <Link underline='hover' color='inherit' href='/'>
        Homepage
      </Link>
      <Typography color='text.primary'>Firma con IO - Panoramica</Typography>
    </MUIBreadcrumbs>
  </div>
);

export default Breadcrumbs;
