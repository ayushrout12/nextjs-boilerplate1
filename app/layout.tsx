import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "trylotus",
  description: "build something you actually want to use",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
