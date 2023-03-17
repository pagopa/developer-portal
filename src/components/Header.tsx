import { HeaderAccount, RootLinkType } from '@pagopa/mui-italia';

const pagoPALink: RootLinkType = {
  href: '/',
  label: 'PagoPA DevPortal',
  title: 'PagoPA DevPortal',
  ariaLabel: 'PagoPA DevPortal',
};

const Header = () => (
  <HeaderAccount
    enableLogin={false}
    enableAssistanceButton={false}
    rootLink={pagoPALink}
    onAssistanceClick={() => {}}
  />
);

export default Header;
