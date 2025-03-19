import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthModal from "./AuthModal";
import SearchBar from "./SearchBar";
import { useAuth } from "@/hooks/useAuth";
import { Film, Search, Sun, Moon, ChevronDown, LogOut, User, Settings } from "lucide-react";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const [location] = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize dark mode based on localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    // Focus search input when opened
    if (!isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white dark:bg-neutral-800 shadow-md py-4 px-4 sm:px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center space-x-2">
            <Film className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">MovieExplorer</span>
          </a>
        </Link>

        {/* Center Nav Links - visible on medium screens and up */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <a className={`text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition duration-200 ${location === "/" ? "text-primary" : ""}`}>
              Home
            </a>
          </Link>
          <Link href="/discover">
            <a className={`text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition duration-200 ${location === "/discover" ? "text-primary" : ""}`}>
              Discover
            </a>
          </Link>
          <Link href="/favorites">
            <a className={`text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition duration-200 ${location === "/favorites" ? "text-primary" : ""}`}>
              My Favorites
            </a>
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition duration-200"
            onClick={toggleSearch}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition duration-200"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* User Menu / Login Button */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative flex items-center space-x-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://i.pravatar.cc/100?img=2" alt={user?.username} />
                    <AvatarFallback>{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => setAuthModalOpen(true)} variant="default" className="bg-primary hover:bg-red-700">
              Login
            </Button>
          )}
        </div>
      </div>

      {/* Search Bar - Hidden by default */}
      {isSearchOpen && (
        <div className="mt-4">
          <SearchBar onClose={() => setIsSearchOpen(false)} inputRef={searchInputRef} />
        </div>
      )}
      
      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </nav>
  );
}
