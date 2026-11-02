import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Header from "./Header";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
  <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
    <Header
      title="Vehicle Manager"
      user={user}
      showMenu={isAdmin}
      onMenuClick={() => setIsSidebarOpen(true)}
    />

    <div className="flex min-h-0 flex-1 overflow-hidden">
      {isAdmin && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  </div>
);
};

export default DashboardLayout;