import '@mui/material/styles';
import '@mui/material/Button';
import '@mui/material/Typography';

declare module '@mui/material/styles' {
  interface Palette {
    europeanUnion: {
      main: string;
      contrastText: string;
    };
    primaryAction: {
      main: string;
      hover: string;
    };
  }

  interface PaletteOptions {
    europeanUnion?: {
      main: string;
      contrastText: string;
    };
    primaryAction?: {
      main: string;
      hover: string;
    };
  }

  interface PaletteColor {
    extraLight?: string;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    naked: true;
  }

  interface ButtonPropsColorOverrides {
    text: true;
    negative: true;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    sidenav: true;
    'caption-semibold': true;
    'body2-semibold': true;
    'body1-semibold': true;
    monospaced: true;
  }
}

// Fix for rapi-doc custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'rapi-doc': any;
    }
  }
}