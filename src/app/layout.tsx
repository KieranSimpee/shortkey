import type { Metadata, Viewport } from "next";
import { Inter, Montserrat, Space_Grotesk } from "next/font/google";
import { ContentStudioShell } from "@/components/cms/ContentStudioShell";
import { CartProvider } from "@/components/commerce/CartProvider";
import { AppChrome } from "@/components/layout/AppChrome";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shortkey",
  description:
    "The AI Beauty Operating System for Asian Beauty. Your Style. Your CTRL.",
  icons: {
    icon: [
      { url: "/logo/shortkey-favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo/shortkey-favicon-64.png", sizes: "64x64", type: "image/png" },
      { url: "/logo/shortkey-favicon-128.png", sizes: "128x128", type: "image/png" },
    ],
    apple: [{ url: "/logo/shortkey-favicon-256.png", sizes: "256x256" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${inter.variable} ${spaceGrotesk.variable} font-sans`}
      >
        <ContentStudioShell>
          <CartProvider>
            <AppChrome>{children}</AppChrome>
          </CartProvider>
        </ContentStudioShell>
      </body>
    </html>
  );
}
