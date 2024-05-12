"use client";
import { MobileSidebar } from "./mobile-sidebar";
import { UserButton } from "@clerk/nextjs";

export const Navbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm">
      <MobileSidebar />
      <div className="flex ml-auto">
        <UserButton afterSignOutUrl="/dashboard" />
      </div>
    </div>
  );
};
