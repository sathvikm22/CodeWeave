
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Visualization from "./pages/Visualization";
import Settings from "./pages/Settings";
import Resources from "./pages/Resources";
import Videos from "./pages/Videos";
import Compare from "./pages/Compare";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Index from "./pages/Index";
import CodeCraft from "./pages/CodeCraft";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider defaultTheme="system">
        <TooltipProvider>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* App Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="visualize/:type" element={<Visualization />} />
              <Route path="algorithms/:type?" element={<Visualization />} />
              <Route path="settings" element={<Settings />} />
              <Route path="resources" element={<Resources />} />
              <Route path="videos" element={<Videos />} />
              <Route path="compare" element={<Compare />} />
              <Route path="codecraft" element={<CodeCraft />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
