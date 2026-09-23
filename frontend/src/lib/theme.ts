export const theme = {
  colors: {
    primary: "#2EA5A1",
    primaryDark: "#247F7C",
    secondary: "#0E263A",
    tertiary: "#265CA0",
    white: "#FFFFFF",
    background: "#F8F6F4",
    border: "#E8E1DD",
    muted: "#6B625D",
  },
  radius: {
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  font: {
    heading: '"Inter", "Plus Jakarta Sans", system-ui, sans-serif',
    body: '"Inter", "Plus Jakarta Sans", system-ui, sans-serif',
  },
  maxWidth: "1280px",
  spacing: {
    sectionDesktop: "120px",
    sectionMobile: "64px",
    pxDesktop: "24px",
    pxMobile: "16px",
  },
} as const;
