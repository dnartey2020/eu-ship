"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  CreditCard,
  GalleryVerticalEnd,
  Home,
  Map,
  MapPin,
  Settings2,
  Truck,
} from "lucide-react";

import { NavMain } from "./nav-main";
// import { NavProjects } from "./nav-project";
import { NavUser } from "./nav-user";
// import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";

// This is sample data.
const data = {
  user: {
    name: "David",
    email: "ryandav@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Euroswrift",
      logo: GalleryVerticalEnd,
      plan: "Logictics",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard/overview",
        },
        {
          title: "Statistics",
          url: "/dashboard/statistics",
        },
      ],
    },
    {
      title: "Shipments",
      url: "/dashboard/shipments",
      icon: Truck,
      items: [
        {
          title: "View Shipments",
          url: "/dashboard/shipment",
        },
        {
          title: "Shipment History",
          url: "/dashboard/shipments",
        },
        {
          title: "Tracking",
          url: "/tracking",
        },
      ],
    },
    {
      title: "Billing",
      url: "/dashboard/billing",
      icon: CreditCard,
      items: [
        {
          title: "Invoices",
          url: "/dashboard/invoices",
        },
        {
          title: "Payment Methods",
          url: "/dashboard/payment-methods",
        },
        {
          title: "Cost Analysis",
          url: "/dashboard/cost-analysis",
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/dashboard/settings/general",
        },
        {
          title: "Profile",
          url: "/dashboard/settings/profile",
        },
        {
          title: "Notifications",
          url: "/dashboard/settings/notifications",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu className="flex h-16 items-start justify-center">
          {/* <TeamSwitcher teams={data.teams} /> */}
          <Image
            src="/images/logo/logo-light.png"
            width={119.03}
            height={30}
            alt="logo"
            className=""
          />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
