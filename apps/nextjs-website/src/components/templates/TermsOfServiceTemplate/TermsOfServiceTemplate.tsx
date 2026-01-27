'use client';
import { Box } from '@mui/material';
import Script from 'next/script';

// Define window interface for OneTrust
interface OneTrustWindow extends Window {
  OneTrust: {
    NoticeApi: {
      Initialized: Promise<void>;
      // eslint-disable-next-line functional/no-return-void
      LoadNotices: (urls: string[]) => void;
    };
  };
}

const TermsOfServiceTemplate = () => {
  return (
    <Box py={6}>
      <div
        id='otnotice-30a52037-d537-4347-9dfc-cfc0cc7d5d13'
        className='otnotice'
      />

      <Script
        src='https://privacyportalde-cdn.onetrust.com/privacy-notice-scripts/otnotice-1.0.min.js'
        type='text/javascript'
        id='otprivacy-notice-script'
        // eslint-disable-next-line functional/no-return-void
        onReady={() => {
          const oneTrustWindow = window as unknown as OneTrustWindow;
          if (oneTrustWindow.OneTrust) {
            // To ensure external settings are loaded, use the Initialized promise:
            oneTrustWindow.OneTrust.NoticeApi.Initialized.then(() => {
              oneTrustWindow.OneTrust.NoticeApi.LoadNotices([
                'https://privacyportalde-cdn.onetrust.com/77f17844-04c3-4969-a11d-462ee77acbe1/privacy-notices/30a52037-d537-4347-9dfc-cfc0cc7d5d13.json',
              ]);
            });
          }
        }}
      />
    </Box>
  );
};

export default TermsOfServiceTemplate;
