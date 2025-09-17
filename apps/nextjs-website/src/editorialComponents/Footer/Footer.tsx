import { Box, Container, Stack } from '@mui/material';
import { FundedByNextGenerationEU } from '@/editorialComponents/FundedByNextGenerationEU';
import { type Generic } from '../types/components';
import { FooterColumn } from './components/FooterColumn';
import { LangSwitch, type LangSwitchProps } from './components/LangSwitch';
import { LegalInfo } from './components/LegalInfo';
import type {
  CompanyLinkType,
  PreLoginFooterLinksType,
  FooterColumnIcon
} from './types';

export interface FooterProps extends LangSwitchProps {
  companyLink: CompanyLinkType;
  legalInfo: string | Generic | Generic[];
  links: PreLoginFooterLinksType;
  showFundedByNextGenerationEULogo?: boolean;
}

export const Footer = ({
  companyLink,
  legalInfo,
  links: { aboutUs, resources, followUs, services },
  showFundedByNextGenerationEULogo = false,
  ...langProps
}: FooterProps) => (
  <Box
    borderColor='divider'
    borderTop='1px'
    component='footer'
    px={{ xs: 2, sm: 4, md: 20 }}
    sx={{ backgroundColor: 'background.paper' }}
  >
    <Container
      maxWidth={false}
      sx={{
        py: 8,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 4
      }}
    >
      <FooterColumn data={aboutUs} companyLink={companyLink} />
      <FooterColumn data={services} />
      <FooterColumn data={resources} />
      <Box
        display='flex'
        flexDirection='column'
        alignItems={{ sm: 'flex-start', xs: 'center' }}
        justifyContent='space-between'
      >
        <Stack display='flex' alignItems={{ xs: 'center', sm: 'start' }}>
          <FooterColumn
            data={followUs}
            icons={followUs.socialLinks as FooterColumnIcon[]}
          />
          {!!langProps?.languages?.length && <LangSwitch {...langProps} />}
        </Stack>
        {showFundedByNextGenerationEULogo && (
          <FundedByNextGenerationEU size={180} />
        )}
      </Box>
    </Container>
    <LegalInfo data={legalInfo} />
  </Box>
);
