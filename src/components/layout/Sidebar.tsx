import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Package, ShoppingCart, Settings, User, X } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";

const Sidebar: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 z-20 bg-black md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 transform border-r bg-white transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} md:relative md:z-0`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-blue-600 p-1 text-white">
              <span className="text-xl font-bold">V</span>
            </div>
            <h1 className="text-xl font-bold">Velocity</h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-100 ${isActive ? "bg-blue-50 font-medium text-blue-600" : "text-gray-700"}`
                }
              >
                <Home size={20} />
                <span>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/products"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-100 ${isActive ? "bg-blue-50 font-medium text-blue-600" : "text-gray-700"}`
                }
              >
                <Package size={20} />
                <span>Manage Products</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/orders"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-100 ${isActive ? "bg-blue-50 font-medium text-blue-600" : "text-gray-700"}`
                }
              >
                <ShoppingCart size={20} />
                <span>Orders Management</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-100 ${isActive ? "bg-blue-50 font-medium text-blue-600" : "text-gray-700"}`
                }
              >
                <User size={20} />
                <span>Profile Settings</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-100 ${isActive ? "bg-blue-50 font-medium text-blue-600" : "text-gray-700"}`
                }
              >
                <Settings size={20} />
                <span>Settings</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
