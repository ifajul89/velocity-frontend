import * as React from "react";
import { Home, User, Settings, ShoppingBag } from "lucide-react";

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

const data = {
  navMain: [
    {
      title: "Track Order Status",
      url: "/track-order",
      items: [],
    },

    {
      title: "Admin: Orders Management",
      url: "/admin/orders",
      items: [],
    },
    {
      title: "Manage Profile Settings",
      url: "/profile",
      items: [],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
            {data.navMain.map((item) => (
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
