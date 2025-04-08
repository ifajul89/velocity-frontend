import * as React from "react"
import { GalleryVerticalEnd, ChevronDown, User, Settings, LogOut, Package, FileText, BarChart, HelpCircle } from "lucide-react"

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
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Track Order Status",
      url: "#",
      items: [
        {
          title: "Track My Order",
          url: "track-my-order",
        },
        {
          title: "Project Structure",
          url: "#",
        },
      ],
    },
    {
      title: "Update Order Status",
      url: "#",
      items: [
        {
          title: "Reflect Updates:",
          url: "#",
        },
      ],
    },
    {
      title: "View Orders",
      url: "#",
      items: [
        {
          title: "Routing",
          url: "#",
        },
        {
          title: "Data Fetching",
          url: "#",
          isActive: true,
        },
      ],
    },
    {
      title: "API Reference",
      url: "#",
    },
    {
      title: "Manage Profile Settings",
      url: "#",
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="relative">
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center justify-between w-full">
                <a href="#" className="flex items-center gap-2">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Velocity</span>
                    <span className="">v1.0.0</span>
                  </div>
                </a>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-1 hover:bg-accent rounded-md transition-colors"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </SidebarMenuButton>
            {isOpen && (
              <div className="absolute left-0 top-full mt-1 w-56 rounded-md border bg-popover p-1 text-popover-foreground shadow-md z-50">
                <div className="flex flex-col gap-1">
                  <a
                    href="/profile"
                    className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    <Package className="h-4 w-4" />
                    Orders
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    <FileText className="h-4 w-4" />
                    Documents
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    <BarChart className="h-4 w-4" />
                    Analytics
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Help & Support
                  </a>
                  <div className="my-1 h-px bg-border" />
                  <a
                    href="#"
                    className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </a>
                </div>
              </div>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
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
  )
}
