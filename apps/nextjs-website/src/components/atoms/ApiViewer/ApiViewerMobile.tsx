import { FC } from 'react';
import '@stoplight/elements/styles.min.css';
import { RedocStandalone } from 'redoc';

type ApiViewerMobileProps = {
  specURL: string;
};

const ApiViewerMobile: FC<ApiViewerMobileProps> = ({ specURL }) => {
  return (
    <RedocStandalone
      specUrl={specURL}
      options={{
        scrollYOffset: 80,
        theme: {
          typography: {
            fontSize: '16px',
            fontFamily: 'Roboto Mono, Roboto, sans-serif',
            optimizeSpeed: true,
            smoothing: 'antialiased',
            headings: {
              fontWeight: 'bold',
              lineHeight: '2em',
            },
            code: {
              fontWeight: '600',
              color: 'rgba(92, 62, 189, 1)',
              wrap: true,
            },
            links: {
              color: 'rgba(246, 20, 63, 1)',
              visited: 'rgba(246, 20, 63, 1)',
              hover: '#fa768f',
            },
          },
          sidebar: {
            width: '300px',
            textColor: '#000000',
            backgroundColor: '#ffffff',
          },
          rightPanel: {
            backgroundColor: 'rgba(55, 53, 71, 1)',
            textColor: '#ffffff',
          },
        },
      }}
    />
  );
};

export default ApiViewerMobile;
