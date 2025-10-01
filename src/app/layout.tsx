import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitHub Explorer",
  description: "An app to explore GitHub",
  authors: [{ name: "Erik Kuznetsov" }],
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <Providers>
          <div role="main">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
