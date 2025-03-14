import {Providers} from "./providers";
import Navbar from "../components/Nav"
import Footer from "../components/Footer"

import localFont from "next/font/local";
import "./globals.css";

export const metadata = {
  title: "Walhez - Official Page",
  description: "Official Page for Walhez",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="font-montserrat flex flex-col min-h-screen">
        <Providers>
          <Navbar />
          <main className="flex-1 w-full mt-16 md:mt-20">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

