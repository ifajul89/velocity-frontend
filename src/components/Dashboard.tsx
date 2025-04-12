import * as React from "react";
import { Home, User, Settings, ShoppingBag } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { JSX } from "react";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import {
  useSidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  url: string;
  icon: JSX.Element;
};

type UserType = {
  role: "admin" | "user";
};

export function AppSidebar() {
  const user = useAppSelector(currentUser) as UserType | null;
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [navMenu, setNavMenu] = React.useState<NavItem[]>([]);

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
    {
      title: "Settings",
      url: "/settings",
      icon: <Settings className="h-4 w-4" />,
    },
    {
      title: "Manage Products",
      url: "/dashboard/manage-products",
      icon: <MdOutlineProductionQuantityLimits className="h-4 w-4" />,
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

  return (
    <Sidebar className="h-screen border-r bg-white">
      <SidebarHeader className="border-b">
        <div className="flex h-16 items-center px-4">
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
      </SidebarHeader>
      <SidebarContent className="h-full flex-1">
        <SidebarMenu className="h-full py-2">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {navMenu.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link to={item.url}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

export function Dashboard() {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
