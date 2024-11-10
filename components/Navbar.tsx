"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Sun, Moon, Menu } from "lucide-react";

import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { navLinksData } from "@/data/nav-links";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useLocalStorage("isDarkMode", true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <nav className="p-4 dark:bg-slate-900 text-gray-900 dark:text-gray-100 shadow-md mb-3">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard</h1>

        {/* desktop links */}
        <NavLinks />

        {/* dark mode toggle */}
        <Button
          variant="ghost"
          onClick={() => setIsDarkMode(!isDarkMode)}
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>

        {/* mobile menu mutton */}
        <MobileMenuPopoverAndTrigger />
      </div>
    </nav>
  );
}

function MobileMenuPopoverAndTrigger() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="ml-4 md:hidden p-2"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-48 p-4 bg-gray-200 dark:bg-gray-900"
      >
        <NavLinks isMobile />
      </PopoverContent>
    </Popover>
  );
}

function NavLinks({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();
  return (
    <ul className={`${!isMobile ? "hidden md:flex space-x-4" : "space-y-3"}`}>
      {navLinksData.map((link) => (
        <li key={link.href}>
          <Link
            prefetch
            href={link.href}
            className={`flex items-center space-x-2 transition-all duration-300 ease-in-out transform ${
              pathname === link.href
                ? "dark:text-blue-500 text-blue-700 scale-105"
                : "text-gray-600"
            } hover:text-blue-600 hover:scale-105 active:scale-95`}
          >
            {link.icon}
            <span>{link.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
