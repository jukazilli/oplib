import type { Metadata } from "next";

import "./styles.css";

export const metadata: Metadata = {
  title: "OPALIB",
  description:
    "Artigos para explorar ideias entre ciência, tecnologia e movimento.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
