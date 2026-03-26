import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthContext";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KrishiBandhu | AI Crop Assistant",
  description: "Empowering farmers with AI-driven disease detection, crop advisory, and market insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} min-h-screen flex flex-col bg-slate-50 selection:bg-green-100 selection:text-green-900`}>
        <div className="fixed inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#dcfce7_100%)]"></div>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow relative">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
