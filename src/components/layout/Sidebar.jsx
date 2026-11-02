import {
  LayoutDashboard,
  Users,
  CarFront,
  Trash2,
  X,
} from "lucide-react";

import NavItem from "./NavItem";

const navItems = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    to: "/admin/drivers",
    label: "All Drivers",
    icon: CarFront,
  },
  {
    to: "/admin/deleted-drivers",
    label: "Deleted Drivers",
    icon: Trash2,
  },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 top-16 z-30 bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
<aside className={`
  fixed bottom-0 left-0 top-16 z-40
  w-64 overflow-y-auto border-r border-gray-200 bg-white p-4
  transition-transform duration-300 ease-in-out
  lg:sticky lg:top-0 lg:z-auto
  lg:h-[calc(100vh-64px)]
  lg:shrink-0
  lg:translate-x-0
  ${
    isOpen
      ? "translate-x-0"
      : "-translate-x-full lg:translate-x-0"
  }
`}
      >
        {/* Mobile Close Button */}
        <div className="mb-4 flex justify-end lg:hidden">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-2" onClick={onClose}>
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;