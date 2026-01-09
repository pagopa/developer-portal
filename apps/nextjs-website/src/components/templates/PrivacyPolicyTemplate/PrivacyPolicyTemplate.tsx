'use client';
import { Box } from '@mui/material';
import Script from 'next/script';

// Define window interface for OneTrust to avoid implicit any
interface OneTrustWindow extends Window {
  OneTrust: {
    NoticeApi: {
      Initialized: Promise<void>;
      // eslint-disable-next-line functional/no-return-void
      LoadNotices: (urls: string[]) => void;
    };
  };
}

const PrivacyPolicyTemplate = () => {
  return (
    <Box py={6}>
      <div
        id='otnotice-5657e5a3-e052-4a97-b533-c60f1c2e1a29'
        className='otnotice'
      />

      <Script
        src='https://privacyportalde-cdn.onetrust.com/privacy-notice-scripts/otnotice-1.0.min.js'
        type='text/javascript'
        id='otprivacy-notice-script'
        // eslint-disable-next-line functional/no-return-void
        onReady={() => {
          // To ensure external settings are loaded, use the Initialized promise:
          const oneTrustWindow = window as unknown as OneTrustWindow;
          if (oneTrustWindow.OneTrust) {
            oneTrustWindow.OneTrust.NoticeApi.Initialized.then(() => {
              oneTrustWindow.OneTrust.NoticeApi.LoadNotices([
                'https://privacyportalde-cdn.onetrust.com/77f17844-04c3-4969-a11d-462ee77acbe1/privacy-notices/5657e5a3-e052-4a97-b533-c60f1c2e1a29.json',
              ]);
            });
          }
        }}
      />
    </Box>
  );
};

export default PrivacyPolicyTemplate;
