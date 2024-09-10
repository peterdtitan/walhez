import {Providers} from "./providers";

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
          {children}
        </Providers>
      </body>
    </html>
  );
}
