import "./globals.css";

export const metadata = {
  title: "Biblioteca Frota Fixa",
  description: "Central de informações do Departamento Frota Fixa",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
