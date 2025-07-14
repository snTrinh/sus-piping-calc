"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import Sidebar from "../components/Sidebar";
import { Box } from "@mui/material";
import ThemeContextProvider from "./ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ display: "flex" }}>
        <ThemeContextProvider>
          <Sidebar />
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Box component="main" sx={{ flexGrow: 1 }}>
              {children}
            </Box>
          </Box>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
