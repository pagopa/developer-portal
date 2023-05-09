import {
  Breadcrumbs as MUIBreadcrumbs,
  Link as MUILink,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { pipe } from 'fp-ts/lib/function';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { Breadcrumbs as BreadcrumbItems } from '@/domain/navigator';

export type BreadcrumbsProps = {
  items: BreadcrumbItems;
};

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <div role='presentation' onClick={void 0}>
      <MUIBreadcrumbs aria-label='breadcrumb'>
        {pipe(
          items,
          RA.map(({ name, path, isCurrent }) =>
            isCurrent ? (
              <Typography color='text.primary' fontWeight='bold' key={path}>
                {name}
              </Typography>
            ) : (
              <MUILink
                underline='hover'
                color='inherit'
                href={path}
                key={path}
                component={Link}
              >
                {name}
              </MUILink>
            )
          )
        )}
      </MUIBreadcrumbs>
    </div>
  );
};

export default Breadcrumbs;
