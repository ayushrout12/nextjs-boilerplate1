import Navbar from "./components/Navbar"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Lotus — The World's Best AI-Powered Web Developer",
  icons: {
    icon: "/lotus.png",
  },
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
