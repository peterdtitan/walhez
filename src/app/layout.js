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
    <html lang="en">
      <body className=''>
        <Providers>
          <Navbar />
          {children}
          <div className="absolute bottom-0 w-full">
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
