import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Menu } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { showToast } from "../../utils/toast";

const Header = ({ title, user, showMenu, onMenuClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout, isLoggingOut } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const displayName = user?.first_name || user?.username || "User";

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    showToast.success("Logged out successfully!");
  };

  return (
    <header className="relative z-50 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {showMenu && (
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>
        )}

        <h1 className="sm:text-sm md:text-lg font-semibold text-gray-800">
          {title || "Vehicle Management"}
        </h1>
      </div>

      {/* Right Section */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          disabled={isLoggingOut}
          className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-100"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold uppercase text-blue-700">
            {displayName.charAt(0)}
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-gray-800">{displayName}</p>
            <p className="text-xs capitalize text-gray-500">
              {user?.role || "User"}
            </p>
          </div>

          <ChevronDown
            size={16}
            className={`text-gray-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
            <div className="border-b border-gray-100 px-4 py-3">
              <p className="text-sm font-medium text-gray-800">{displayName}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              <LogOut size={17} />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
