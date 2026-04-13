import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "./context/AuthContext";
import { AppDataProvider } from "./context/AppDataContext";
import "./styles/global.css";
import "./styles/variables.css";
import "./styles/layout.css";
import "./styles/navbar.css";
import "./styles/footer.css";
import "./styles/home.css";
import "./styles/sports.css";
import "./styles/auth.css";
import "./styles/admin.css";
import "./styles/responsive.css";
import "./styles/pages.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppDataProvider>
          <App />
          <Analytics />
        </AppDataProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);