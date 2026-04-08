import { createRoot } from "react-dom/client";
import { AppErrorBoundary } from "./components/app-error-boundary";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>,
);
