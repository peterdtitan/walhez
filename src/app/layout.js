import {Providers} from "./providers";
import AppFrame from "@/components/AppFrame";
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
          <AppFrame>{children}</AppFrame>
        </Providers>
      </body>
    </html>
  );
}
