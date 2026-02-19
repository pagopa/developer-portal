import {
    createTheme,
    alpha,
    PaletteColorOptions,
} from '@mui/material';
import { CSSProperties } from 'react';
import { indigo } from '@mui/material/colors';

// --- Utility ---
function pxToRem(value: number): string {
    return `${value / 16}rem`;
}

// --- Colors ---
const colorTextPrimary = '#17324D';
const shadowColor = '#002B55';
const colorPrimaryContainedHover = '#0055AA';

// --- Fonts ---
const mainTypeface = 'var(--font-titillium-web), sans-serif';
const monospacedTypeface = '"Roboto Mono", monospace'; // Fallback as DM Mono is not loaded

// --- Constants ---
const focusWidth = '2px';
const focusBorderRadius = '8px';
const focusOffset = '4px';
const focusButtonOffset = '2px';
const alertBorderWidth = '4px';

// --- Module Augmentation ---
declare module '@mui/material/styles' {
    interface TypographyVariants {
        headline: CSSProperties;
        sidenav: CSSProperties;
        monospaced: CSSProperties;
        'caption-semibold': CSSProperties;
    }

    interface TypographyVariantsOptions {
        headline?: CSSProperties;
        sidenav?: CSSProperties;
        monospaced?: CSSProperties;
        'caption-semibold'?: CSSProperties;
    }

    interface Palette {
        pagoPA: Palette['primary'];
        europeanUnion: Palette['primary'];
        checkIban: Palette['primary'];
        extraLight: Palette['warning'];
        primaryAction: Palette['action'];
        negative: PaletteColorOptions;
        indigo: Palette['primary'];
    }
    interface PaletteOptions {
        pagoPA?: PaletteOptions['primary'];
        europeanUnion?: PaletteOptions['primary'];
        checkIban?: PaletteOptions['primary'];
        extraLight?: PaletteOptions['warning'];
        primaryAction?: PaletteOptions['action'];
        negative?: PaletteColorOptions;
        indigo?: PaletteColorOptions;
    }
}

declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        headline: true;
        sidenav: true;
        monospaced: true;
        'caption-semibold': true;
    }
}

declare module '@mui/material/Badge' {
    interface BadgePropsVariantOverrides {
        sidenav: true;
    }
}

// Update PaletteColor to include extraLight
declare module '@mui/material/styles' {
    interface PaletteColor {
        extraLight?: string;
        100?: string;
        850?: string;
    }
    interface SimplePaletteColorOptions {
        extraLight?: string;
        100?: string;
        850?: string;
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        blueItaly: true;
        text: true;
        primary: true;
        negative: true;
        secondary: false;
        warning: false;
        info: false;
        success: false;
    }

    interface ButtonPropsVariantOverrides {
        secondary: false;
        naked: true;
    }
}

declare module '@mui/material/IconButton' {
    interface IconButtonPropsColorOverrides {
        secondary: false;
        info: false;
        success: false;
        warning: false;
        error: false;
    }
}

declare module '@mui/material/Checkbox' {
    interface CheckboxPropsColorOverrides {
        secondary: false;
        info: false;
        warning: false;
    }
}

declare module '@mui/material/Radio' {
    interface RadioPropsColorOverrides {
        secondary: false;
        info: false;
        warning: false;
    }
}

declare module '@mui/material/Pagination' {
    interface ButtonPropsColorOverrides {
        blueItaly: true;
        text: true;
        secondary: false;
        warning: false;
        info: false;
        success: false;
    }
    interface PaginationPropsVariantOverrides {
        outlined: false;
    }
}

declare module '@mui/material/Chip' {
    export interface ChipPropsColorOverrides {
        indigo: true;
    }
}

// --- Foundation (Base Theme) ---
const shadowValues = {
    4: `0px 2px 4px -1px ${alpha(shadowColor, 0.1)}, 0px 4px 5px ${alpha(
        shadowColor,
        0.05
    )}, 0px 1px 10px ${alpha(shadowColor, 0.1)}`,
    8: `0px 8px 10px -5px ${alpha(shadowColor, 0.1)}, 0px 16px 24px 2px ${alpha(
        shadowColor,
        0.05
    )}, 0px 6px 30px 5px ${alpha(shadowColor, 0.1)}`,
    16: `0px 8px 10px -5px ${alpha(shadowColor, 0.1)}, 0px 16px 24px 2px ${alpha(
        shadowColor,
        0.05
    )}, 0px 6px 30px 5px ${alpha(shadowColor, 0.1)}`,
};
// eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-explicit-any
const shadowsArray = Array(25).fill('none') as any;

const foundation = {
    breakpoints: {
        values: { xs: 0, sm: 640, md: 900, lg: 1200, xl: 1536 },
    },
    palette: {
        mode: 'light' as const,
        common: { black: '#000', white: '#fff' },
        background: { paper: '#FFFFFF', default: '#F2F2F2' },
        primary: {
            main: '#0073E6',
            light: '#2185E9',
            dark: '#0062C3',
            contrastText: '#FFFFFF',
            100: '#C4DCF5',
        },
        secondary: {
            main: '#00C5CA',
            light: '#21CDD1',
            dark: '#00A7AC',
            contrastText: '#FFFFFF',
        },
        pagoPA: { main: '#0066CC', contrastText: '#fff' },
        checkIban: { main: '#008CA8', contrastText: '#fff' },
        europeanUnion: { main: '#264CA4', contrastText: '#fff' },
        indigo: { main: indigo[500], contrastText: '#fff' },
        negative: { main: '#FFFFFF', contrastText: '#0066CC' },
        text: {
            primary: colorTextPrimary,
            secondary: '#5C6F82',
            disabled: '#A2ADB8',
        },
        action: {
            active: '#5C6F82',
            hover: 'rgba(23, 50, 77, 0.08)',
            hoverOpacity: 0.08,
            selected: 'rgba(23, 50, 77, 0.12)',
            disabled: 'rgba(23, 50, 77, 0.26)',
            disabledBackground: 'rgba(23, 50, 77, 0.12)',
            focus: 'rgba(23, 50, 77, 0.12)',
        },
        primaryAction: {
            hover: 'rgba(0, 115, 230, 0.12)',
            selected: 'rgba(0, 115, 230, 0.12)',
        },
        divider: '#E3E7EB',
        error: {
            main: '#FE6666',
            dark: '#D85757',
            light: '#FE7A7A',
            extraLight: '#FB9EAC',
            contrastText: colorTextPrimary,
            100: '#FFE0E0',
            850: '#761F1F',
        },
        info: {
            main: '#6BCFFB',
            dark: '#5BB0D5',
            light: '#7ED5FC',
            extraLight: '#86E1FD',
            contrastText: colorTextPrimary,
            100: '#E1F5FE',
            850: '#215C76',
        },
        success: {
            main: '#6CC66A',
            dark: '#5CA85A',
            light: '#7FCD7D',
            extraLight: '#B5E2B4',
            contrastText: colorTextPrimary,
            100: '#E1F4E1',
            850: '#224021',
        },
        warning: {
            main: '#FFCB46',
            dark: '#D9AD3C',
            light: '#FFD25E',
            extraLight: '#FFE5A3',
            contrastText: colorTextPrimary,
            100: '#FFF5DA',
            850: '#614C15',
        },
    },
    typography: {
        allVariants: { color: colorTextPrimary },
        fontFamily: mainTypeface,
        fontWeightRegular: 400,
        fontWeightMedium: 600,
        fontWeightBold: 700,
        fontSize: 16,
        htmlFontSize: 16,
    },
    shadows: { ...shadowsArray, ...shadowValues },
    shape: { borderRadius: 4 },
    spacing: 8,
};

// --- Theme Creation ---
export const theme = createTheme(foundation as Parameters<typeof createTheme>[0], {
    typography: {
        headline: {
            fontSize: pxToRem(58),
            fontFamily: mainTypeface,
            color: colorTextPrimary,
            lineHeight: 1.1,
            fontWeight: 700,
        },
        h1: {
            fontSize: pxToRem(42),
            lineHeight: 1.1,
            fontWeight: 700,
            [`@media (min-width:640px)`]: { fontSize: pxToRem(50), lineHeight: 1.08 },
        },
        h2: {
            fontSize: pxToRem(36),
            lineHeight: 1.1,
            fontWeight: 700,
            [`@media (min-width:640px)`]: { fontSize: pxToRem(44), lineHeight: 1.09 },
        },
        h3: {
            fontSize: pxToRem(32),
            lineHeight: 1.125,
            fontWeight: 700,
            [`@media (min-width:640px)`]: { fontSize: pxToRem(38), lineHeight: 1.1 },
        },
        h4: {
            fontSize: pxToRem(28),
            lineHeight: 1.15,
            fontWeight: 700,
            [`@media (min-width:640px)`]: {
                fontSize: pxToRem(32),
                lineHeight: 1.125,
            },
        },
        h5: {
            fontSize: pxToRem(24),
            lineHeight: 1.15,
            fontWeight: 600,
            [`@media (min-width:640px)`]: { fontSize: pxToRem(28), lineHeight: 1.5 },
        },
        h6: {
            fontSize: pxToRem(22),
            lineHeight: 1.18,
            fontWeight: 600,
            [`@media (min-width:640px)`]: { fontSize: pxToRem(24), lineHeight: 1.15 },
        },
        sidenav: {
            fontFamily: mainTypeface,
            fontSize: pxToRem(18),
            lineHeight: 1.35,
            color: colorTextPrimary,
            fontWeight: 600,
        },
        body1: {
            fontSize: pxToRem(18),
            lineHeight: 1.5,
            fontWeight: 400,
            letterSpacing: 0,
        },
        body2: {
            fontSize: pxToRem(16),
            lineHeight: 1.4,
            fontWeight: 400,
            letterSpacing: 0.15,
        },
        button: { lineHeight: 1.2, textTransform: 'none', letterSpacing: 0 },
        caption: { fontSize: pxToRem(14), lineHeight: 1.4, fontWeight: 400 },
        'caption-semibold': {
            fontFamily: mainTypeface,
            fontSize: pxToRem(14),
            lineHeight: 1.4,
            color: colorTextPrimary,
            fontWeight: 600,
        },
        monospaced: {
            fontFamily: monospacedTypeface,
            fontSize: pxToRem(16),
            lineHeight: 1.4,
            color: colorTextPrimary,
            letterSpacing: '0.15px',
            fontWeight: 400,
        },
        overline: {
            fontSize: pxToRem(14),
            lineHeight: 1.15,
            fontWeight: 700,
            letterSpacing: 1,
        },
        subtitle1: { fontWeight: 600 },
        subtitle2: { fontSize: pxToRem(14), fontWeight: 600 },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    fontFamily: mainTypeface,
                },
            },
        },
        MuiButton: {
            defaultProps: { disableElevation: true, disableFocusRipple: true },
            styleOverrides: {
                root: {
                    fontFamily: mainTypeface,
                    padding: '0 20px',
                    minHeight: pxToRem(24),
                    minWidth: pxToRem(24),
                    '&.Mui-focusVisible': {
                        borderRadius: focusBorderRadius,
                        outline: `solid ${focusWidth} ${foundation.palette.primary.main}`,
                        outlineOffset: focusButtonOffset,
                        boxShadow: 'none',
                    },
                    '&.MuiButton-text': {
                        '&:hover': { backgroundColor: 'transparent', color: '#0055AA' },
                    },
                    '&.MuiButton-contained': {
                        '&:hover': { backgroundColor: '#0055AA' },
                    },
                },
                sizeSmall: {
                    height: '40px',
                    padding: '0 20px',
                    fontSize: pxToRem(14),
                    lineHeight: 1.25,
                },
                sizeMedium: {
                    height: '48px',
                    padding: '0 24px',
                    fontSize: pxToRem(16),
                    lineHeight: 1.25,
                },
                sizeLarge: {
                    height: '56px',
                    padding: '0 24px',
                    fontSize: pxToRem(18),
                    lineHeight: 1.2,
                },
                outlined: {
                    borderWidth: '2px',
                    '&:hover': { borderWidth: '2px' },
                    '&:disabled': { borderWidth: '2px' },
                },
                outlinedPrimary: {
                    borderColor: foundation.palette.primary.main,
                    '&:hover': {
                        color: foundation.palette.primary.dark,
                        borderColor: 'currentColor',
                    },
                },
                outlinedError: {
                    borderColor: foundation.palette.error.main,
                    '&:hover': {
                        color: foundation.palette.error.dark,
                        borderColor: 'currentColor',
                    },
                    '&.Mui-focusVisible': {
                        borderRadius: focusBorderRadius,
                        outline: `solid ${focusWidth} ${foundation.palette.error.main}`,
                        outlineOffset: focusOffset,
                        boxShadow: 'none',
                    },
                },
            },
            variants: [
                {
                    props: { variant: 'naked' },
                    style: {
                        color: foundation.palette.text.primary,
                        padding: 0,
                        height: 'auto',
                        minWidth: 'auto',
                        '&:hover': {
                            color: alpha(foundation.palette.text.primary, 0.8),
                            backgroundColor: 'transparent',
                        },
                        '&.Mui-focusVisible': {
                            borderRadius: focusBorderRadius,
                            outline: `solid ${focusWidth} ${foundation.palette.text.primary}`,
                            outlineOffset: focusOffset,
                            boxShadow: 'none',
                        },
                    },
                },
                {
                    props: { variant: 'naked', color: 'primary' },
                    style: {
                        color: foundation.palette.primary.main,
                        '&:hover': { color: colorPrimaryContainedHover },
                        '&.Mui-focusVisible': {
                            borderRadius: focusBorderRadius,
                            outline: `solid ${focusWidth} ${foundation.palette.primary.main}`,
                            outlineOffset: focusButtonOffset,
                            boxShadow: 'none',
                        },
                    },
                },
                {
                    props: { variant: 'naked', color: 'error' },
                    style: {
                        color: foundation.palette.error.main,
                        '&:hover': { color: foundation.palette.error.light },
                        '&.Mui-focusVisible': {
                            borderRadius: focusBorderRadius,
                            outline: `solid ${focusWidth} ${foundation.palette.error.main}`,
                            outlineOffset: focusButtonOffset,
                            boxShadow: 'none',
                        },
                    },
                },
            ],
        },
        MuiIconButton: {
            defaultProps: { disableRipple: true },
            styleOverrides: {
                root: {
                    color: foundation.palette.primary.main,
                    '&:hover': {
                        backgroundColor: alpha(foundation.palette.primary.main, 0.08),
                    },
                    '&:active': {
                        backgroundColor: alpha(foundation.palette.primary.main, 0.2),
                    },
                    '&.Mui-focusVisible': {
                        backgroundColor: alpha(foundation.palette.primary.main, 0.2),
                        outline: `solid ${focusWidth} ${foundation.palette.primary.main}`,
                        outlineOffset: focusButtonOffset,
                        boxShadow: 'none',
                    },
                },
                colorPrimary: {
                    color: foundation.palette.primary.contrastText,
                    backgroundColor: foundation.palette.primary.main,
                    '&:hover': {
                        backgroundColor: alpha(foundation.palette.primary.main, 0.08),
                        color: foundation.palette.primary.main,
                    },
                },
                sizeSmall: { minHeight: pxToRem(24), minWidth: pxToRem(24) },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    fontFamily: mainTypeface,
                    fontSize: pxToRem(14),
                    backgroundColor: '#455B71',
                    fontWeight: 600,
                    textAlign: 'center',
                    boxShadow:
                        '0px 8px 10px -5px rgba(0, 43, 85, 0.1), 0px 16px 24px 2px rgba(0, 43, 85, 0.05), 0px 6px 30px 5px rgba(0, 43, 85, 0.1)',
                },
                arrow: { color: '#455B71' },
            },
        },
        MuiBreadcrumbs: {
            styleOverrides: {
                root: {
                    fontFamily: mainTypeface,
                    fontSize: pxToRem(16),
                    color: foundation.palette.text.primary
                },
                li: {
                    'a:hover': { textDecoration: 'none' },
                    p: { fontSize: `${pxToRem(16)} !important` },
                    svg: { fontSize: pxToRem(20), marginRight: foundation.spacing * 1.5 },
                },
                separator: { color: foundation.palette.text.secondary },
            },
        },
        MuiStepLabel: {
            styleOverrides: {
                label: {
                    fontFamily: mainTypeface,
                    fontSize: pxToRem(14),
                    [`@media (min-width:640px)`]: { fontSize: pxToRem(14) },
                    '&.Mui-completed': { fontWeight: 600 },
                    '&.Mui-active': { fontWeight: 600 },
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    fontFamily: mainTypeface,
                    borderLeft: `${alertBorderWidth} solid`,
                    padding: '8px',
                    color: colorTextPrimary,
                    alignItems: 'center',
                    [`@media (min-width:640px)`]: { padding: '16px' },
                },
                icon: {
                    opacity: 1,
                    padding: 0,
                    alignItems: 'center',
                    marginRight: '8px',
                    [`@media (min-width:640px)`]: { marginRight: '16px' },
                },
                message: { padding: 0, overflow: 'inherit', fontFamily: mainTypeface },
                action: { marginRight: 0, paddingTop: 0 },
                outlined: {
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0px 2px 4px -1px rgba(0, 43, 85, 0.1)',
                    borderWidth: `0 0 0 ${alertBorderWidth}`,
                },
                standard: { '& .MuiAlert-icon': { color: colorTextPrimary } },
                standardSuccess: { borderColor: foundation.palette.success.main },
                outlinedSuccess: {
                    borderColor: foundation.palette.success.main,
                    '& .MuiAlert-icon': { color: foundation.palette.success.main },
                },
                standardError: { borderColor: foundation.palette.error.main },
                outlinedError: {
                    borderColor: foundation.palette.error.main,
                    '& .MuiAlert-icon': { color: foundation.palette.error.main },
                },
                standardInfo: { borderColor: foundation.palette.info.main },
                outlinedInfo: {
                    borderColor: foundation.palette.info.main,
                    '& .MuiAlert-icon': { color: foundation.palette.info.main },
                },
                standardWarning: { borderColor: foundation.palette.warning.main },
                outlinedWarning: {
                    borderColor: foundation.palette.warning.main,
                    '& .MuiAlert-icon': { color: foundation.palette.warning.main },
                },
            },
        },
        MuiAlertTitle: {
            styleOverrides: {
                root: {
                    fontFamily: mainTypeface,
                    fontSize: pxToRem(16),
                    fontWeight: 600,
                    letterSpacing: 0.15,
                    margin: 0,
                    [`@media (min-width:640px)`]: { fontSize: pxToRem(16) },
                },
            },
        },
        MuiCard: { styleOverrides: { root: { borderRadius: '8px' } } },
        MuiCardContent: { styleOverrides: { root: { padding: '24px' } } },
        MuiCardActions: {
            styleOverrides: { root: { padding: '24px', paddingTop: 0 } },
        },
        MuiSnackbarContent: {
            styleOverrides: {
                root: {
                    fontFamily: mainTypeface,
                    padding: '16px',
                    color: foundation.palette.text.primary,
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0px 2px 4px -1px rgba(0, 43, 85, 0.1)',
                },
                action: { marginRight: 0 },
                message: { padding: 0, fontSize: pxToRem(16), fontFamily: mainTypeface },
            },
        },
        MuiBadge: {
            styleOverrides: {
                badge: { fontFamily: mainTypeface, fontSize: pxToRem(14), fontWeight: 600, letterSpacing: 0.15 },
            },
        },
    },
});
