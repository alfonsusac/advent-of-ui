import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Acme } from 'next/font/google';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const acmeSans = Acme({
  weight: "400",
})

export const metadata: Metadata = {
  title: "Advent of UI",
  description: "A UI challenge for the holiday season",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${acmeSans.className}`}
      >
        {children}
      </body>
    </html>
  );
}
