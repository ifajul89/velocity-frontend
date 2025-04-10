import * as React from "react";
import { Home, User, Settings, ShoppingBag } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface NavItem {
  title: string;
  url: string;
  items: NavItem[];
  adminOnly?: boolean;
}

interface User {
  id?: string;
  email?: string;
  role?: string;
}

// Define navigation items with adminOnly flag
const navItems: NavItem[] = [
  {
    title: "Track Order Status",
    url: "/track-order",
    items: [],
    adminOnly: false,
  },
  {
    title: "Admin: Orders Management",
    url: "/admin/orders",
    items: [],
    adminOnly: true,
  },
  {
    title: "Manage Profile Settings",
    url: "/profile",
    items: [],
    adminOnly: false,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user && (user as User).role === "admin";
  
  // Filter navigation items based on role
  const filteredNavItems = navItems.filter(item => 
    !item.adminOnly || (item.adminOnly && isAdmin)
  );

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center">
          <div className="bg-primary mr-2 flex h-6 w-6 items-center justify-center rounded-md text-white">
            V
          </div>
          <span className="font-bold">Velocity</span>
          <Badge variant="outline" className="ml-auto">
            v1.0.0
          </Badge>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to={'/'} className="flex items-center gap-2 font-medium">
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {filteredNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    to={item.url}
                    className="flex items-center gap-2 font-medium"
                  >
                    {item.title === "Track Order Status" && (
                      <ShoppingBag className="h-4 w-4" />
                    )}
                    {item.title === "Manage Profile Settings" && (
                      <User className="h-4 w-4" />
                    )}
                    {item.title === "Admin: Orders Management" && (
                      <Settings className="h-4 w-4" />
                    )}
                    {item.title}
                  </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link to={subItem.url}>{subItem.title}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
