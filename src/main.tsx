import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "motion/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { onExternalChange } from "./api";
import App from "./App";
import { ToastProvider } from "./components/ui/Toast";
import { AuthProvider } from "./lib/auth";
import { watchSystemTheme } from "./lib/theme";
import "./index.css";

// Every successful mutation refreshes all queries, so admin and customer views stay in sync.
const queryClient: QueryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } },
  mutationCache: new MutationCache({ onSuccess: () => queryClient.invalidateQueries() }),
});

onExternalChange(() => queryClient.invalidateQueries());
watchSystemTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <MotionConfig reducedMotion="user">
            <ToastProvider>
              <App />
            </ToastProvider>
          </MotionConfig>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
