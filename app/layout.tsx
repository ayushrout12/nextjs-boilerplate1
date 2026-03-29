import Navbar from "./components/Navbar";

export const metadata = {
  title: "Lotus — The World's Developer",
  description: "Build powerful apps with AI using Lotus.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
