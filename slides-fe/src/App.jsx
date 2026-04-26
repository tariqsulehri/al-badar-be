import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/menu/nav";
import AppRoutes from "./routes";

const AUTH_ROUTES = ["/login"];

const App = () => {
  const location = useLocation();
  const isAuthRoute = AUTH_ROUTES.includes(location.pathname);

  return (
    <div className={`app-shell ${isAuthRoute ? "app-shell--auth" : ""}`}>
      {!isAuthRoute && <Navbar />}
      <main className="app-shell__content">
        <AppRoutes />
      </main>
    </div>
  );
};

export default App;
