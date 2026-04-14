import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import AppPage from "@desktop/pages/AppPage";

const queryClient = new QueryClient();

const DesktopApp = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="flav-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <MemoryRouter initialEntries={["/"]}>
            <Routes>
              <Route path="/" element={<AppPage />} />
              <Route path="*" element={<AppPage />} />
            </Routes>
          </MemoryRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default DesktopApp;
