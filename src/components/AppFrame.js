"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Nav";
import Footer from "./Footer";

export default function AppFrame({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      <Navbar />
      <main className={`flex-1 w-full ${isAdminRoute ? "" : "mt-16 md:mt-20"}`}>
        {children}
      </main>
      <Footer />
    </>
  );
}
