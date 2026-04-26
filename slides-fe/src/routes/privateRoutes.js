import { lazy } from "react";
const ChangePassword = lazy(() => import("../features/auth/change.password"));
const routeObjects = [{
  path: '/user/pass',
  component: ChangePassword
}]

export default routeObjects;