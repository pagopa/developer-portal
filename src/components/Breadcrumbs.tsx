import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { pipe } from 'fp-ts/lib/function';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as O from 'fp-ts/lib/Option';
import { NavLinks } from '@/domain/navLinks';
import { navLinks } from '@/adapters/static/staticNavLink';

const getBreadcrumbPath = (navLinks: NavLinks, currentPath: string) =>
  pipe(
    navLinks,
    RA.findFirst(({ path }) => currentPath.startsWith(path)),
    O.chain(({ name: parentName, children }) =>
      pipe(
        children,
        RA.findFirst(({ path }) => path === currentPath),
        O.map(({ name: childName }) => `${parentName} - ${childName}`)
      )
    ),
    O.getOrElseW(() => null)
  );

const Breadcrumbs = () => {
  const path = getBreadcrumbPath(navLinks, useRouter().route);
  return (
    <div role='presentation' onClick={() => {}}>
      <MUIBreadcrumbs aria-label='breadcrumb'>
        <Link underline='hover' color='inherit' href='/'>
          Homepage
        </Link>
        {path && (
          <Typography color='text.primary' fontWeight='bold'>
            {path}
          </Typography>
        )}
      </MUIBreadcrumbs>
    </div>
  );
};

export default Breadcrumbs;
