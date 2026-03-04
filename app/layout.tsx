import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const raleway = Raleway({
  subsets: ["latin", "latin-ext"],
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: "Section Builder — Systeme.io",
  description: "Generate and edit HTML sections for Systeme.io sales pages",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${raleway.variable} font-sans antialiased`}>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
