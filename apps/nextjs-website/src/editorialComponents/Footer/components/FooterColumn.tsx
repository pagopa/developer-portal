import { Link as LinkMui, Stack, Typography } from '@mui/material';
import { hrefNoOp } from '@/editorialComponents/utils';
import {
  type CompanyLinkType,
  type PreLoginFooterSingleSectionType,
} from '../types';
import IconWrapper, {
  IconWrapperProps,
} from '@/components/atoms/IconWrapper/IconWrapper';
import { LogoPagoPACompany } from '@/editorialComponents/LogoPagoPACompany';
import Link from 'next/link';

export interface FooterColumnProps {
  data: PreLoginFooterSingleSectionType;
  companyLink?: CompanyLinkType;
  icons?: (IconWrapperProps & { href: string })[];
}

export const FooterColumn = ({
  data,
  companyLink,
  icons,
}: FooterColumnProps) => (
  <Stack spacing={2} display='flex' alignItems={{ xs: 'center', sm: 'start' }}>
    {data?.title && <Typography variant='overline'>{data.title}</Typography>}

    {companyLink && (
      <LinkMui
        component={Link}
        role='link'
        aria-label={companyLink.ariaLabel}
        href={companyLink.href ?? hrefNoOp}
        sx={{ display: 'inline-flex' }}
      >
        <LogoPagoPACompany />
      </LinkMui>
    )}

    {icons && (
      <Stack
        aria-label='i nostri social'
        spacing={{ xs: 3, sm: 1.5, lg: 3 }}
        direction='row'
        component='ul'
        alignItems={{ xs: 'center', sm: 'start' }}
        sx={{ padding: 0, mt: 0.5, listStyle: 'none' }}
      >
        {icons?.map(
          ({ icon, href = hrefNoOp, ...rest }, i) =>
            icon && (
              <li key={i}>
                <LinkMui href={href}>
                  <IconWrapper icon={icon} {...rest} />
                </LinkMui>
              </li>
            )
        )}
      </Stack>
    )}

    <Stack
      component='ul'
      alignItems={{ xs: 'center', sm: 'start' }}
      textAlign={{ xs: 'center', sm: 'left' }}
      sx={{ padding: 0, listStyle: 'none' }}
    >
      {data?.links.map(({ href = hrefNoOp, label, ariaLabel, onClick }, i) => (
        <li key={i}>
          <LinkMui
            aria-label={ariaLabel}
            component={'a'}
            href={href}
            onClick={onClick}
            underline='none'
            color='text.primary'
            sx={{ display: 'inline-block', py: 0.5 }}
            variant='subtitle2'
          >
            {label}
          </LinkMui>
        </li>
      ))}
    </Stack>
  </Stack>
);
