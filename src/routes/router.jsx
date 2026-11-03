import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";
import Loader from "../components/common/Loader";

// Lazy loaded pages
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));

const Drivers = lazy(() => import("../pages/user/Drivers"));

const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const Users = lazy(() => import("../pages/admin/Users"));
const AllDrivers = lazy(() => import("../pages/admin/AllDrivers"));
const DeletedDrivers = lazy(() => import("../pages/admin/DeletedDrivers"));

const withSuspense = (Component) => (
  <Suspense fallback={<Loader />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  // Public Routes
  { path: "/login", element: withSuspense(Login) },
  { path: "/register", element: withSuspense(Register) },

  // User Routes
  {
    element: <ProtectedRoute allowedRoles={["user"]} />,
    children: [
      {
        path: "/",
        element: <DashboardLayout />,
        children: [{ index: true, element: withSuspense(Drivers) }],
      },
    ],
  },

  // Admin Routes
  {
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        path: "/admin",
        element: <DashboardLayout />,
        children: [
          { index: true, element: withSuspense(Dashboard) },
          { path: "users", element: withSuspense(Users) },
          { path: "drivers", element: withSuspense(AllDrivers) },
          { path: "deleted-drivers", element: withSuspense(DeletedDrivers) },
        ],
      },
    ],
  },
]);

export default router;
