import { Header } from "../_components/Header";
import { Footer } from "../_components/Footer";
import { SmoothScroll } from "@/_components/SmoothScroll";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
