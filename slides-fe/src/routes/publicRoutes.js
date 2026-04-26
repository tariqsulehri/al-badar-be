import { lazy } from "react";
const Home = lazy(() => import("../pages/homepage/homepage"));
const Login = lazy(() => import("../pages/login/login"));

const routeObjects = [{
  path: '/',
  component: Home
}, {
  path: '/login',
  component: Login
}]

export default routeObjects;