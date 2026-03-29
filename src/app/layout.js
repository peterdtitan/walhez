import { Providers } from "./providers";
import AppFrame from "@/components/AppFrame";
import "./globals.css";

const siteDescription =
  "Walhez Group delivers equipment leasing, project support, and operational reporting across construction and excavation work.";
const siteOrigin =
  process.env.APP_URL || process.env.APP_BASE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: "Walhez Group | Official Site",
    template: "Walhez Group | %s",
  },
  description: siteDescription,
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Walhez Group | Official Site",
    description: siteDescription,
    images: [
      {
        url: "/logo.png",
        alt: "Walhez Group logo",
      },
    ],
  },
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
