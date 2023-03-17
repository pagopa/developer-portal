import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from '@mui/material';
import { useRouter } from 'next/router';

const Breadcrumbs = () => {
  // Gives us ability to load the current route details
  const router = useRouter();
  router.route;
  return (
    <div role='presentation' onClick={() => {}}>
      <MUIBreadcrumbs aria-label='breadcrumb'>
        <Link underline='hover' color='inherit' href='/'>
          Homepage
        </Link>
        <Typography color='text.primary'>Firma con IO - Panoramica</Typography>
      </MUIBreadcrumbs>
    </div>
  );
};

export default Breadcrumbs;
