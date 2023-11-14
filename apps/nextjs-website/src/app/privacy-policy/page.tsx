'use client';
import { Box } from '@mui/material';
import Script from 'next/script';

const PrivacyPolicy = () => {
  return (
    <Box py={6}>
      <div
        id='otnotice-119e178b-550d-4327-a0ee-29ff8cf6701c'
        className='otnotice'
      />

      <Script
        src='https://privacyportalde-cdn.onetrust.com/privacy-notice-scripts/otnotice-1.0.min.js'
        type='text/javascript'
        id='otprivacy-notice-script'
        onReady={() => {
          // eslint-disable-next-line no-var
          var settings =
            'eyJjYWxsYmFja1VybCI6Imh0dHBzOi8vcHJpdmFjeXBvcnRhbC1kZS5vbmV0cnVzdC5jb20vcmVxdWVzdC92MS9wcml2YWN5Tm90aWNlcy9zdGF0cy92aWV3cyJ9';
          // To ensure external settings are loaded, use the Initialized promise:
          if ((window as any).OneTrust) {
            (window as any).OneTrust.NoticeApi.Initialized.then(() => {
              (window as any).OneTrust.NoticeApi.LoadNotices([
                'https://privacyportalde-cdn.onetrust.com/77f17844-04c3-4969-a11d-462ee77acbe1/privacy-notices/119e178b-550d-4327-a0ee-29ff8cf6701c.json',
              ]);
            });
          }
        }}
      />
    </Box>
  );
};

export default PrivacyPolicy;
