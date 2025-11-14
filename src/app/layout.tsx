"use client";

import { store } from "@/state/store";
import { Inter } from "next/font/google";
import Sidebar from "../components/common/Sidebar";

import { useState } from "react";
import { Provider } from "react-redux";
import ThemeContextProvider from "./ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body style={{ display: "flex" }}>
        <Provider store={store}>
          <ThemeContextProvider>
            <Sidebar />
            <main style={{ flexGrow: 1 }}>{children}</main>
          </ThemeContextProvider>
        </Provider>
      </body>
    </html>
  );
}
