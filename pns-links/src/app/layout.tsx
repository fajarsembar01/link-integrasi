import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased">
        <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-4 py-6">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
