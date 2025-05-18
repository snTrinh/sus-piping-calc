import "./globals.css";
import { Inter } from "next/font/google";
import Sidebar from "../components/Sidebar";

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
        <Sidebar />
        <div style={{ flexGrow: 1, padding: "16px" }}>
          <div className="flex min-h-screen">{children}</div>
        </div>
      </body>
    </html>
  );
}
