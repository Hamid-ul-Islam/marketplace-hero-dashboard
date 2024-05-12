"use client";

import { List, BarChart, Users } from "lucide-react";
import SidebarItem from "./sidebar-item";
import { usePathname } from "next/navigation";

const isAdmin = false

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "dashboard/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "dashboard/teacher/analytics",
  },
  {
    icon: Users,
    label: "Manage Users",
    href: "dashboard/teacher/users",
  },
];
const adminRoutes = [
  {
    icon: List,
    label: " Test-Admins-Courses",
    href: "dashboard/admin/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "dashboard/admin/analytics",
  },
  {
    icon: Users,
    label: "Manage Users",
    href: "dashboard/admin/users",
  },
];


export const SidebarRoutes = () => {

  const routes = isAdmin ? adminRoutes : teacherRoutes


    return (
      <div className="flex flex-col w-full">
        {routes.map((route, index) => (
          <SidebarItem
            key={index}
            icon={route.icon}
            label={route.label}
            href={route.href}
          />
        ))}
      </div>
    );
}