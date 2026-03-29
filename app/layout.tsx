import Navbar from "./components/Navbar"

export const metadata = {
  title: "Lotus — The World's Best AI-Powered Web Developer",
  description: "Build powerful apps with AI using Lotus."
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
