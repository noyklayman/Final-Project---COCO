import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "react-toastify/ReactToastify.css";
import { AuthContextProvider } from "./context/auth.context";
import { HashRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <HashRouter>
      <App />
    </HashRouter>
  </AuthContextProvider>
);
