import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { theme } from "./theme/mantine-theme";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import MantineDemo from "./pages/MantineDemo";
import Login from "./pages/auth/Login";
import Verify from "./pages/auth/Verify";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <MantineProvider theme={theme} defaultColorScheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Notifications />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Auth routes - public */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/verify" element={<Verify />} />
              
              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mantine-demo"
                element={
                  <ProtectedRoute>
                    <MantineDemo />
                  </ProtectedRoute>
                }
              />
              
              {/* Add more project-specific routes here */}
              
              {/* Catch-all routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </MantineProvider>
);

export default App;
