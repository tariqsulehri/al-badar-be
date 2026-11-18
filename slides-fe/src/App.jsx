import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AppHeader from "./components/layout/AppHeader";
import Sidebar from "./components/layout/Sidebar";
import AppRoutes from "./routes";
import { useCurrentUser, useIsLoggedIn } from "./utils/utilAuth";

const AUTH_ROUTES = ["/login"];
const COLLAPSE_KEY = "ui-sidebar-collapsed";

const readCollapsed = () => {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === "1";
  } catch {
    return false;
  }
};

const App = () => {
  const location = useLocation();
  const isLoggedIn = useIsLoggedIn();
  const currentUser = useCurrentUser();
  const isAuthRoute = AUTH_ROUTES.includes(location.pathname);
  const showSidebar = isLoggedIn && Boolean(currentUser) && !isAuthRoute;

  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the mobile drawer after navigating.
  useEffect(() => setMobileOpen(false), [location.pathname]);

  const toggleCollapsed = () =>
    setCollapsed((prev) => {
      try {
        localStorage.setItem(COLLAPSE_KEY, prev ? "0" : "1");
      } catch {
        // storage unavailable — keep the in-memory value only
      }
      return !prev;
    });

  if (isAuthRoute) {
    return (
      <div className="app-shell app-shell--auth">
        <main className="app-shell__content">
          <AppRoutes />
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <AppHeader
        currentUser={showSidebar ? currentUser : null}
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
        onOpenMobile={() => setMobileOpen(true)}
      />

      <div className="flex">
        {showSidebar && (
          <>
            <Sidebar
              currentUser={currentUser}
              collapsed={collapsed}
              mobileOpen={mobileOpen}
              onCloseMobile={() => setMobileOpen(false)}
            />
            {mobileOpen && (
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-30 bg-bg-dark/40 backdrop-blur-[2px] lg:hidden"
              />
            )}
          </>
        )}

        <main className="app-shell__content min-w-0 flex-1">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
};

export default App;
