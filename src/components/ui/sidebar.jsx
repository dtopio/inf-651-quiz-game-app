import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext.jsx";
import {
  HomeIcon,
  QuestionMarkCircleIcon,
  StarIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const [hideNav, setHideNav] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;

      setHasScrolled(currentY > 20);

      const delta = currentY - lastY;

      if (delta > 10 && currentY > 100) {
        setHideNav(true);
      }
      else if (delta < -10 || currentY < 100) {
        setHideNav(false);
      }

      lastY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { to: "/", label: "Home", icon: HomeIcon },
    { to: "/quiz", label: "Quiz", icon: QuestionMarkCircleIcon },
    { to: "/score", label: "Score", icon: StarIcon },
    { to: "/settings", label: "Settings", icon: Cog6ToothIcon },
    { to: "/about", label: "About", icon: InformationCircleIcon },
  ];

  const handleNavClick = () => {
    if (window.innerWidth < 768) setOpen(false);
  };

  return (
    <header
      className={`
        fixed inset-x-0 top-0 z-40
        transition-all duration-500 ease-out
        ${hideNav ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}
        ${
          hasScrolled
            ? "shadow-lg backdrop-blur-xl"
            : "shadow-none backdrop-blur-none"
        }
      `}
      style={{
        background: 'var(--sidebar-bg)',
        opacity: hasScrolled ? 0.95 : 1
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`
            flex items-center justify-between gap-4
            transition-all duration-300
            ${hasScrolled ? "py-2 md:py-2" : "py-3 md:py-4"}
          `}
        >
          <div className="flex items-center gap-2" style={{ color: 'var(--sidebar-text)' }}>
            <div
              className={`
                flex items-center justify-center rounded-2xl shadow-md
                transition-all duration-300
                ${hasScrolled ? "h-8 w-8 text-xl" : "h-9 w-9 text-2xl"}
                bg-white/15
              `}
            >
              {theme === 'christmas' ? '🎅' : '🧠'}
            </div>

            <div className="leading-tight">
              <span className="text-xl font-semibold tracking-wide">
                {theme === 'christmas' ? '🎄 Quiz Game 🎁' : 'Quiz Game'}
              </span>
              <div className="text-[10px] opacity-80">
                {theme === 'christmas' ? 'Festive Learning' : 'Learn something new'}
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-3">
            {/* eslint-disable-next-line no-unused-vars */}
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={handleNavClick}
                style={({ isActive }) => ({
                  background: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.15)',
                  color: isActive ? 'var(--nav-active)' : 'rgba(255, 255, 255, 0.9)',
                })}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                    "hover:bg-white/25 shadow-sm",
                    isActive && "shadow-md",
                  ].join(" ")
                }
              >
                <Icon className="h-5 w-5" />
                {label}
              </NavLink>
            ))}
          </nav>

          <button
            className="md:hidden inline-flex items-center justify-center rounded-full bg-white/15 p-2 shadow"
            style={{ color: 'var(--sidebar-text)' }}
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <nav className="md:hidden pb-3">
            <div className="flex flex-col gap-2">
              {/* eslint-disable-next-line no-unused-vars */}
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={handleNavClick}
                  style={({ isActive }) => ({
                    background: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.1)',
                    color: isActive ? 'var(--nav-active)' : 'rgba(255, 255, 255, 0.9)',
                  })}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 px-4 py-2 rounded-2xl text-sm font-medium",
                      "hover:bg-white/20 transition-all",
                      isActive && "shadow-md",
                    ].join(" ")
                  }
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
