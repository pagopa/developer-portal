import { HeaderAccount, RootLinkType } from '@pagopa/mui-italia';

const pagoPALink: RootLinkType = {
  href: '/',
  label: 'PagoPA Dev Portal',
  title: 'PagoPA Dev Portal',
  ariaLabel: 'PagoPA Dev Portal',
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
