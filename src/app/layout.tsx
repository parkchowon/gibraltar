import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const pretendardFont = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "지브롤터 | Gibraltar",
  description: "Microblogging platform for overwatch lover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr">
      <body className={`${pretendardFont.className}`}>{children}</body>
    </html>
  );
}
