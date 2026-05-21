import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteShell } from "@/components/site-shell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0A0F1F",
};

export const metadata: Metadata = {
  title: "defense.codes | Supply chain risk intelligence",
  description:
    "Strategic supply chain risk analysis reports for Defense, Space, and Aerospace.",
  icons: {
    icon: [
      {
        url: "/favicon.ico?v=dc2",
        sizes: "32x32",
        type: "image/x-icon",
      },
      { url: "/icon.png?v=dc2", type: "image/png" },
      { url: "/logo.png?v=dc2", type: "image/png" },
    ],
    apple: { url: "/logo.png?v=dc2", type: "image/png" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-full min-h-[100dvh] flex-col bg-[#0A0F1F] font-[family-name:var(--font-inter)] text-slate-100">
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
