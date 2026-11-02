
import { NavLink } from "react-router-dom";

const NavItem = ({ to, icon: Icon, label }) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
          isActive
            ? "bg-blue-700 text-white"
            : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
        }`
      }
    >
      {Icon && <Icon size={19} />}
      <span>{label}</span>
    </NavLink>
  );
};

export default NavItem;
