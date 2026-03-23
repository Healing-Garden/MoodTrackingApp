export const theme = {
    colors: {
        // Core Palette
        "primary": "#276b2e",
        "primaryContainer": "#60a560",
        "onPrimary": "#ffffff",
        "onPrimaryContainer": "#00370b",

        "secondary": "#0c6780",
        "onSecondary": "#ffffff",
        "onSecondaryContainer": "#09657f",
        "secondaryContainer": "#9ae1ff",

        "tertiary": "#705d00",
        "tertiaryContainer": "#caa910",
        "onTertiary": "#ffffff",
        "onTertiaryContainer": "#4c3e00",

        // Tonal Layering (Design System Requirement)
        "background": "#ebffe6", // surface
        "surface": "#ebffe6",
        "surfaceVariant": "#caebc6",
        "surfaceBright": "#ffffff",
        "surfaceDim": "#c2e3be",
        "surfaceContainerLowest": "#ffffff",
        "surfaceContainerLow": "#dbfdd7", // section
        "surfaceContainer": "#d6f7d1",
        "surfaceContainerHigh": "#d0f1cc", // inputs
        "surfaceContainerHighest": "#caebc6", // cards

        "onSurface": "#06210a", // Text Color Requirement
        "onSurfaceVariant": "#40493e",
        "onBackground": "#06210a",

        "outline": "#717a6d",
        "outlineVariant": "#c0c9bb",

        "error": "#ba1a1a",
        "errorContainer": "#ffdad6",
        "onError": "#ffffff",
        "onErrorContainer": "#93000a",

        "white": "#ffffff",
        "transparent": 'transparent',
    },
    spacing: {
        // Editorial Spacing (+4 padding increment)
        xs: 8,
        sm: 12,
        md: 20,
        lg: 28,
        xl: 36,
        xxl: 52,
        xxxl: 72,
        pebble: 40,
    },
    borderRadius: {
        sm: 12,
        md: 16, // 1rem
        lg: 32, // 2rem (Design System Requirement)
        xl: 48, // 3rem (Design System Requirement)
        full: 9999,
    },
    fonts: {
        headline: 'Plus Jakarta Sans',
        body: 'Be Vietnam Pro',
        elegant: 'Dancing Script',
    },
    typography: {
        displayLarge: {
            fontSize: 56,
            fontWeight: '800',
            letterSpacing: -0.02 * 56,
            lineHeight: 64,
        },
        headline: {
            fontSize: 36,
            fontWeight: '800',
            letterSpacing: -0.02 * 36,
            lineHeight: 44,
        },
        body: {
            fontSize: 18,
            fontWeight: '400',
            lineHeight: 28,
        },
        label: {
            fontSize: 14,
            fontWeight: '700',
            letterSpacing: 2,
        }
    },
    shadows: {
        // Editorial Shadow: 0 12px 32px rgba(6, 33, 10, 0.06)
        soft: {
            shadowColor: '#06210A',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.06,
            shadowRadius: 32,
            elevation: 4,
        },
        // For buttons/hover effects
        primary: {
            shadowColor: '#276B2E',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.1,
            shadowRadius: 32,
            elevation: 8,
        }
    }
};
