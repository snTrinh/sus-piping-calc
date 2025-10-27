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
          mode, 
          ...(mode === "light"
            ? {
         
                primary: {
                  main: "#61AFEF", 
                  light: "#4791db",
                  dark: "#115293",
                  contrastText: "#fff",
                },
                secondary: {
                  main: "#98C379", 
                  light: "#e33371",
                  dark: "#9a0036",
                  contrastText: "#fff",
                },
                background: {
                  paper: "#ffffff",
                  default: "#F8F9FA", 
                },
                text: {
                  primary: "#343A40", 
                  secondary: "#6C757D", 
                },
                divider: "#E0E3E7", 
              }
            : {
          
                primary: {
                  main: "#61AFEF", 
                  light: "#e3f2fd",
                  dark: "#42a5f5",
                  contrastText: "#000", 
                },
                secondary: {
                  main: "#98C379",
                  light: "#ffc1e3",
                  dark: "#c2185b", 
                  contrastText: "#000",
                },
                warning: {
                  main: "#D19A66", 
                },
                feedback: {
                  main: "#E06C75", 
                  light: "#FFCDD2", 
                },
                background: {
                  default: "#282C34",
                  paper: "#3C434F", 
                },
                text: {
                  primary: "#ABB2BF", 
                },

                divider: "#565F70", 
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
