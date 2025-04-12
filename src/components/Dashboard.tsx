import * as React from "react";
import { Home, User, Settings, ShoppingBag, Menu } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { JSX } from "react";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";


type NavItem = {
  title: string;
  url: string;
  icon: JSX.Element;
};

type UserType = {
  role: "admin" | "user";
};

export function Dashboard() {
  const user = useAppSelector(currentUser) as UserType | null;

  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [navMenu, setNavMenu] = React.useState<NavItem[]>([]);

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  // admin menu
  const adminMenu: NavItem[] = [
    {
      title: "Add Product",
      url: "/dashboard/add-product",
      icon: <MdOutlineProductionQuantityLimits className="h-4 w-4" />,
    },
    {
      title: "Admin: Orders Management",
      url: "/admin/orders",
      icon: <Settings className="h-4 w-4" />,
    },
    {
      title: "Manage Profile Settings",
      url: "/profile",
      icon: <User className="h-4 w-4" />,
    },
  ];

  // user menu
  const userMenu: NavItem[] = [
    {
      title: "Track Order Status",
      url: "/track-order",
      icon: <ShoppingBag className="h-4 w-4" />,
    },
    {
      title: "Manage Profile Settings",
      url: "/profile",
      icon: <User className="h-4 w-4" />,
    },
  ];

  React.useEffect(() => {
    if (user?.role === "admin") {
      setNavMenu(adminMenu);
    } else if (user?.role === "user") {
      setNavMenu(userMenu);
    }
  }, [user?.role]);

  React.useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 border-r bg-white transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex h-16 items-center border-b px-4">
          <div className="flex w-full items-center">
            {!isCollapsed && (
              <>
                <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white">
                  V
                </div>
                <span className="font-bold">Velocity</span>
                <span className="ml-auto rounded-full border px-2 py-0.5 text-xs">
                  v1.0.0
                </span>
              </>
            )}
            {isCollapsed && (
              <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white">
                V
              </div>
            )}
          </div>
        </div>
        <div className="p-2">
          <nav>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/"
                  className="flex items-center gap-2 rounded-md p-2 hover:bg-gray-100"
                >
                  <Home className="h-4 w-4" />
                  {!isCollapsed && "Home"}
                </Link>
              </li>
              {navMenu.map((item) => (
                <li key={item.title}>
                  <Link
                    to={item.url}
                    className="flex items-center gap-2 rounded-md p-2 hover:bg-gray-100"
                  >
                    {item.icon}
                    {!isCollapsed && item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex flex-1 flex-col overflow-auto transition-all ${
          isCollapsed ? "md:ml-16" : "md:ml-64"
        }`}
      >
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 border-b bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <button
              onClick={toggleSidebar}
              className="rounded-md p-2 hover:bg-gray-100 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-4">
              {/* Optional: Profile, Notifications etc. */}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
