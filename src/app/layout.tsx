import "./globals.css";
import { Inter } from "next/font/google";
import Sidebar from "../components/Sidebar";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ThemeContextProvider, { useThemeMode } from "./ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sus Calcs",
  description: "Pipe Thickness Tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ display: "flex" }}>
        <ThemeContextProvider>
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            {/* Top Header */}
            <Box
              component="header"
              sx={{
                height: 56,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                px: 2,
                borderBottom: "1px solid #e0e0e0",
                backgroundColor: "#fff",
              }}
            >
              <IconButton edge="end" color="default" aria-label="settings">
                <SettingsIcon />
              </IconButton>
            </Box>

            {/* Page Content */}
            <Box component="main" sx={{ flexGrow: 1, padding: 2 }}>
              <div className="flex min-h-screen">{children}</div>
            </Box>
          </Box>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
