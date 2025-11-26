import * as React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

import {
  HomeIcon,
  QuestionMarkCircleIcon,
  StarIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

export const Sidebar = React.forwardRef(
  ({ className, isOpen, onToggle, ...props }, ref) => {
    const handleNavClick = () => {
      if (!onToggle) return;
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        onToggle();
      }
    };
    return (
      <>
        {/* Hamburger thingy */}
        <button
          className="
            fixed top-5 left-5 z-50 
            p-2 bg-purple-700 text-white 
            rounded-md shadow-lg
          "
          onClick={onToggle}
        >
          {isOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>

        {/* Sidebar */}
        <div
          ref={ref}
          className={cn(
            "fixed top-0 left-0 h-screen w-64",
            "bg-gradient-to-b from-purple-700/70 to-purple-900/70 backdrop-blur-xl",
            "border-r border-purple-300/20 shadow-2xl",
            "transition-transform duration-300",
            isOpen ? "translate-x-0" : "-translate-x-full",
            "z-40",
            className
          )}
          {...props}
        >
          <SidebarHeader>Quiz Game</SidebarHeader>

          <nav className="flex flex-col mt-6 gap-2 px-4">
            <SidebarLink to="/" icon={<HomeIcon className="w-5 h-5" />} onClick={handleNavClick}>
              Home
            </SidebarLink>

            <SidebarLink
              to="/quiz"
              icon={<QuestionMarkCircleIcon className="w-5 h-5" /> }
              onClick={handleNavClick}
            >
              Quiz
            </SidebarLink>

            <SidebarLink to="/score" icon={<StarIcon className="w-5 h-5" />} onClick={handleNavClick}>
              Score
            </SidebarLink>

            <SidebarLink
              to="/settings"
              icon={<Cog6ToothIcon className="w-5 h-5" />}
              onClick={handleNavClick}
            >
              Settings
            </SidebarLink>

            <SidebarLink
              to="/about"
              icon={<InformationCircleIcon className="w-5 h-5" />}
              onClick={handleNavClick}
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
        "p-6 pl-20 text-2xl font-bold tracking-wide text-white/90",
        "border-b border-white/20",
        className
      )}
      {...props}
    />
  )
);
SidebarHeader.displayName = "SidebarHeader";

export const SidebarLink = React.forwardRef(
  ({ className, to, icon, children,onClick, ...props }, ref) => (
    <NavLink
      ref={ref}
      to={to}
      onClick={onClick}
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
