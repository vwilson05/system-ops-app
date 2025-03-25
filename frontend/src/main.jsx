import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'; 
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import { FilterProvider } from "./context/FilterContext"; // ✅ Ensure correct import path

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <FilterProvider> {/* ✅ Wrap the app in the filter provider */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </FilterProvider>
  </QueryClientProvider>
);
