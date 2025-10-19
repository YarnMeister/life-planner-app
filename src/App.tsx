import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <MantineProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Notifications />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Add project-specific routes here */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </MantineProvider>
);

export default App;
