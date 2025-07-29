import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { SignInForm } from "@/components/auth/SignInForm";
import { Dashboard } from "@/components/dashboard/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/signup"
            element={
              <SignUpForm
                onSwitchToSignIn={() => {
                  window.location.href = "/signin";
                }}
                onSignUpSuccess={() => {
                  window.location.href = "/dashboard";
                }}
              />
            }
          />
          <Route
            path="/signin"
            element={
              <SignInForm
                onSwitchToSignUp={() => {
                  window.location.href = "/signup";
                }}
                onSignInSuccess={() => {
                  window.location.href = "/dashboard";
                }}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                onSignOut={() => {
                  window.location.href = "/";
                }}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
