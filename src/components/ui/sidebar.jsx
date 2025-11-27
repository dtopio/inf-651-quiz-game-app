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

        {/* Sidebar - uses theme-specific gradient and shadow */}
        <div
          ref={ref}
          className={cn(
            "fixed top-0 left-0 h-screen w-64",
            "backdrop-blur-xl",
            "border-r shadow-2xl",
            "transition-transform duration-300",
            isOpen ? "translate-x-0" : "-translate-x-full",
            "z-40",
            className
          )}
          style={{
            background: 'var(--sidebar-gradient)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--sidebar-shadow)'
          }}
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
        "p-6 pl-20 text-2xl font-bold tracking-wide",
        "border-b",
        className
      )}
      style={{
        color: 'var(--text)',
        borderColor: 'var(--border)'
      }}
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
          "hover:opacity-90 active:scale-[0.98]",
          isActive && "backdrop-blur-md font-semibold shadow-inner",
          className
        )
      }
      style={({ isActive }) => ({
        color: 'var(--text)',
        background: isActive ? 'var(--link-active)' : 'transparent',
        ':hover': {
          background: 'var(--link-hover)'
        }
      })}
      {...props}
    >
      {icon}
      {children}
    </NavLink>
  )
);
SidebarLink.displayName = "SidebarLink";
