export interface OTWindow extends Window {
  // eslint-disable-next-line functional/no-return-void
  OptanonWrapper: () => void;
  OneTrust: {
    // eslint-disable-next-line functional/no-return-void
    OnConsentChanged: (callback: () => void) => void;
    // eslint-disable-next-line functional/no-return-void
    ToggleInfoDisplay: () => void;
  };
}

const targCookiesGroup = 'C0002'; // Target cookies (Mixpanel)

// Reading cookie instead of checking window.OneTrust.OptanonActiveGroups
// because it will NEVER be instantiated at page load when we first check
export const hasConsent = () => {
  const OTCookieValue: string =
    document.cookie
      .split('; ')
      .find((row) => row.startsWith('OptanonConsent=')) || '';
  const checkValue = `${targCookiesGroup}%3A1`;
  return OTCookieValue.indexOf(checkValue) > -1;
};
