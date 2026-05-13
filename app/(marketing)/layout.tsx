import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { type ReactNode } from "react";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
