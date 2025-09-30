import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GitHub Explorer",
  description: "An app to explore GitHub",
  authors: [{ name: "Erik Kuznetsov" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <div role="main">{children}</div>
      </body>
    </html>
  );
}
