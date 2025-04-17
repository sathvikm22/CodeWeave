
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Visualization from "./pages/Visualization";
import Sorting from "./pages/Sorting";
import Resources from "./pages/Resources";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Set theme based on user preference or system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) {
    document.documentElement.classList.add('dark');
  }

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/visualization" element={<Visualization />} />
              <Route path="/visualization/:structureId" element={<Visualization />} />
              <Route path="/sorting" element={<Sorting />} />
              <Route path="/sorting/:algorithm" element={<Sorting />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;
