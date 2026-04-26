import  {Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import NotFound from "../pages/notfound/notFound";

import PrivateRouteValidator from "./components/PrivateRouteValidator";
import privateRoutes from "./privateRoutes";

import PublicRouteValidator from "./components/PublicRouteValidator";
import publicRoutes from "./publicRoutes";

import ProtectedRouteValidator from "./components/ProtectedRouteValidator";
import protectedRoutes from "./protectedRoutes";
import Loader from "../components/common/loader/loader.spinner";

function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="*" exact strict element={<NotFound />} />
        {publicRoutes.map((route, index) => (
          <Route
            path={route.path}
            key={index}
            exact
            strict
            element={
              <PublicRouteValidator>
                <route.component />
              </PublicRouteValidator>
            }
          />
        ))}

        {privateRoutes.map((route, index) => (
          <Route
            path={route.path}
            key={index}
            exact
            strict
            element={
              <PrivateRouteValidator>
                <route.component />
              </PrivateRouteValidator>
            }
          />
        ))}
        {protectedRoutes.map((route, index) => (
          <Route
            path={route.path}
            key={index}
            exact
            strict
            element={
              <ProtectedRouteValidator>
                <route.component />
              </ProtectedRouteValidator>
            }
          />
        ))}
        {/* <Route
          path="/"
          exact
          strict
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          exact
          strict
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        /> */}

        {/* <Route
          path="/user/pass"
          exact
          strict
          element={
            <PrivateRoute>
              <ChangePassword />
            </PrivateRoute>
          }
        /> */}

        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRouteValidator>
              <Dashboard />
            </ProtectedRouteValidator>
          }
        />

        <Route
          path="/user/create"
          exact
          strict
          element={
            <ProtectedRouteValidator>
              <CreateUser />
            </ProtectedRouteValidator>
          }
        />

        <Route
          path="/user/list"
          exact
          strict
          element={
            <ProtectedRouteValidator>
              <UserList />
            </ProtectedRouteValidator>
          }
        /> */}
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
