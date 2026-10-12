import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ADPA Claims Workspace",
  description: "Private responsive claims workspace with saved inventories, coverage accounting, and communication follow-ups.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
