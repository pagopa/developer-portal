import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from '@mui/material';
import { pipe } from 'fp-ts/lib/function';
import * as RA from 'fp-ts/lib/ReadonlyArray';

import { Breadcrumbs as BreadcrumbItems } from '@/domain/navigator';

type BreadcrumbsProps = {
  items: BreadcrumbItems;
};

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <div role='presentation' onClick={() => {}}>
      <MUIBreadcrumbs aria-label='breadcrumb'>
        {pipe(
          items,
          RA.map(({ name, path, isCurrent }) =>
            isCurrent ? (
              <Typography color='text.primary' fontWeight='bold' key={path}>
                {name}
              </Typography>
            ) : (
              <Link underline='hover' color='inherit' href={path} key={path}>
                {name}
              </Link>
            )
          )
        )}
      </MUIBreadcrumbs>
    </div>
  );
};

export default Breadcrumbs;
