import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Documentation from "./pages/Documentation";
import NotFound from "./pages/NotFound";
import APITokens from "./pages/APITokens";
import API from "./pages/API";
import Playground from "./pages/Playground";
import HealthMonitor from "./pages/HealthMonitor";
import Navbar from "./components/Navbar";
import { UserProvider } from "./contexts/UserContext";
import { LanguageProvider } from "./contexts/LanguageContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navbar />
            <div>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/documentation" element={<Documentation />} />
                <Route path="/api-tokens" element={<APITokens />} />
                <Route path="/playground" element={<Playground />} />
                <Route path="/health" element={<HealthMonitor />} />
                <Route path="/api/*" element={<API />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
