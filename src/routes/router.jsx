import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Drivers from "../pages/user/Drivers";

import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import AllDrivers from "../pages/admin/AllDrivers";
import DeletedDrivers from "../pages/admin/DeletedDrivers";

import DashboardLayout from "../components/layout/DashboardLayout";

const router = createBrowserRouter([
  // Public Routes
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // User Routes
  {
    element: <ProtectedRoute allowedRoles={["user"]} />,
    children: [
      {
        path: "/",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Drivers />,
          },
        ],
      },
    ],
  },

//  Admin Routes
  {
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        path: "/admin",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "users",
            element: <Users />,
          },
          {
            path: "drivers",
            element: <AllDrivers />,
          },
          {
            path: "deleted-drivers",
            element: <DeletedDrivers />,
          },
        ],
      },
    ],
  },
]);

export default router;
