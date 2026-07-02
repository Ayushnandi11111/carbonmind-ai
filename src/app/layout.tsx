import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import OfflineIndicator from "@/components/OfflineIndicator";
import { UserProvider } from "@/context/UserContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/lib/ToastContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#040D0A] text-white">
        <UserProvider>
          <ThemeProvider>
            <ToastProvider>
              <div className="flex min-h-screen w-full">
                <OfflineIndicator />

                <Sidebar />

                <main className="flex flex-1 flex-col overflow-hidden">
                  <Header />

                  <div className="flex-1 overflow-y-auto">
                    {children}
                  </div>
                </main>
              </div>
            </ToastProvider>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}