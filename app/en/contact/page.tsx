// app/en/contact/page.tsx
import ContactSection from "@/app/components/contact/ContactSection";
import Footer from "@/app/components/Footer";

export default function ContactPageEn() {
  return (
    <>
      <main className="w-full min-h-screen bg-black">
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
