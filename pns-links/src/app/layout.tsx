import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
