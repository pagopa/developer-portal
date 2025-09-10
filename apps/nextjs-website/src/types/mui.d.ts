import '@mui/material/styles';
import '@mui/material/Button';
import '@mui/material/Typography';

declare module '@mui/material/styles' {
  interface Palette {
    readonly europeanUnion: {
      readonly main: string;
      readonly contrastText: string;
    };
    readonly primaryAction: {
      readonly main: string;
      readonly hover: string;
    };
  }

  interface PaletteOptions {
    readonly europeanUnion?: {
      readonly main: string;
      readonly contrastText: string;
    };
    readonly primaryAction?: {
      readonly main: string;
      readonly hover: string;
    };
  }

  interface PaletteColor {
    readonly extraLight?: string;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    readonly naked: true;
  }

  interface ButtonPropsColorOverrides {
    readonly text: true;
    readonly negative: true;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    readonly sidenav: true;
    readonly 'caption-semibold': true;
    readonly 'body2-semibold': true;
    readonly 'body1-semibold': true;
    readonly monospaced: true;
  }
}
