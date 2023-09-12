import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import React from "react";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        <main className="min-h-screen">
          <App />
          <Toaster />
        </main>
      </NextUIProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
