import * as React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

import {
  HomeIcon,
  QuestionMarkCircleIcon,
  StarIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

export const Sidebar = React.forwardRef(({ className, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-purple-700 text-white rounded-md md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✖" : "☰"}
      </button>

      {/* Sidebar */}
      <div
        ref={ref}
        className={cn(
          // --- SIZE ---
          "sidebar w-64 min-h-screen shadow-2xl",

          // --- BACKGROUND STYLING ---
          "bg-gradient-to-b from-purple-700/70 to-purple-900/70 backdrop-blur-xl",
          "border-r border-purple-300/20",

          // --- MOBILE: fixed and slides in/out ---
          isOpen
            ? "fixed top-0 left-0 translate-x-0"
            : "fixed top-0 left-0 -translate-x-full",

          // --- DESKTOP: fixed -- keeps sidebar pinned and prevents layout shift ---
          "md:fixed md:top-0 md:left-0 md:translate-x-0",


          // --- TRANSITIONS ---
          "transition-transform duration-300",

          className
        )}
        {...props}
      >
        <SidebarHeader>Quiz Game</SidebarHeader>

        <nav className="flex flex-col mt-6 gap-2 px-4">
          <SidebarLink to="/" icon={<HomeIcon className="w-5 h-5" />}>
            Home
          </SidebarLink>

          <SidebarLink
            to="/quiz"
            icon={<QuestionMarkCircleIcon className="w-5 h-5" />}
          >
            Quiz
          </SidebarLink>

          <SidebarLink to="/score" icon={<StarIcon className="w-5 h-5" />}>
            Score
          </SidebarLink>

          <SidebarLink
            to="/settings"
            icon={<Cog6ToothIcon className="w-5 h-5" />}
          >
            Settings
          </SidebarLink>

          <SidebarLink
            to="/about"
            icon={<InformationCircleIcon className="w-5 h-5" />}
          >
            About
          </SidebarLink>
        </nav>
      </div>
    </>
  );
});
Sidebar.displayName = "Sidebar";

export const SidebarHeader = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "p-6 text-2xl font-bold tracking-wide text-white/90 sidebar-header",
        "border-b border-white/20",
        className
      )}
      {...props}
    />
  )
);
SidebarHeader.displayName = "SidebarHeader";

export const SidebarLink = React.forwardRef(
  ({ className, to, icon, children, ...props }, ref) => (
    <NavLink
      ref={ref}
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 p-3 rounded-lg transition-all",
          "text-white/90 hover:text-white",
          "hover:bg-white/10 active:scale-[0.98]",
          isActive && "bg-white/20 backdrop-blur-md font-semibold shadow-inner",
          className
        )
      }
      {...props}
    >
      {icon}
      {children}
    </NavLink>
  )
);
SidebarLink.displayName = "SidebarLink";
