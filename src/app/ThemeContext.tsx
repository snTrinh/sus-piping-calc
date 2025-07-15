// app/ThemeContext.tsx
"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const ThemeModeContext = createContext({
  toggleTheme: () => {},
  mode: "light" as "light" | "dark",
});

export const useThemeMode = () => useContext(ThemeModeContext);

export default function ThemeContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode, // This already tells MUI to use light or dark defaults
          ...(mode === "light"
            ? {
                // Light Mode Palette Customizations
                primary: {
                  main: "#61AFEF", // A standard blue for light mode primary
                  light: "#4791db",
                  dark: "#115293",
                  contrastText: "#fff",
                },
                secondary: {
                  main: "#98C379", // A standard red for secondary
                  light: "#e33371",
                  dark: "#9a0036",
                  contrastText: "#fff",
                },
                background: {
                  paper: "#ffffff", // Very light grey background
                  default: "#F8F9FA", // White for cards, sidebar, etc.
                },
                text: {
                  primary: "#343A40", // Dark text
                  secondary: "#6C757D", // Lighter dark text for secondary
                },
                divider: "#E0E3E7", // Light divider
                // You can add more specific colors here, e.g., error, warning, info, success
              }
            : {
                // Dark Mode Palette Customizations
                primary: {
                  main: "#61AFEF", // A lighter blue that contrasts well in dark mode
                  light: "#e3f2fd",
                  dark: "#42a5f5",
                  contrastText: "#000", // Black text for this light primary color
                },
                secondary: {
                  main: "#98C379", // A lighter red/pink that contrasts well
                  light: "#ffc1e3",
                  dark: "#c2185b", 
                  contrastText: "#000",
                },
                warning: {
                  main: "#D19A66", // Use amber for warning in dark mode
                },
                feedback: {
                  main: "#E06C75", // Use deep orange for feedback in dark mode
                  light: "#FFCDD2", // Lighter shade for feedback
                },
                background: {
                  default: "#282C34", // Very dark grey background (Material Design default)
                  paper: "#3C434F", // Slightly lighter dark grey for cards, sidebar
                },
                text: {
                  primary: "#ABB2BF", // White text
                },

                divider: "#565F70", // Dark divider
                // You can add more specific colors here for dark mode
              }),
        },

      }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={{ toggleTheme, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
