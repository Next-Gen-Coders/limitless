import React from "react";
import { Sun, Bell, ChevronDown, User, Menu } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface HeaderProps {
  toggleSidebar?: () => void;
  toggleMobileSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMobileSidebar }) => {
  const { toggleTheme } = useTheme();

  return (
    <>
      {/* Desktop Header */}
      <div className="hidden md:flex bg-gray-900 border-b border-gray-800 px-6 py-4 items-center justify-between">
        {/* Left side - Logo */}
        <div className="flex items-center space-x-4">
          <img
            src="/logo.png"
            alt="Limitless"
            className="h-8 w-8 rounded-full"
          />
          <span className="text-white text-lg font-bold font-family-zilla">
            limitless
          </span>
        </div>

        {/* Right side - Theme toggle, notifications, and user profile */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Sun size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Bell size={20} />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <span className="text-white text-sm font-medium">Sandy</span>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-gray-900 border-b border-gray-800 flex items-center justify-center p-4 relative">
        <Menu
          onClick={toggleMobileSidebar}
          className="w-5 h-5 text-gray-400 absolute left-4 cursor-pointer hover:text-white transition-colors"
        />
        <div className="flex items-center space-x-2">
          <img
            src="/logo.png"
            alt="Limitless"
            className="h-8 w-8 rounded-full"
          />
          <span className="text-white text-lg font-bold font-family-zilla">
            limitless
          </span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-400 hover:text-white transition-colors absolute right-4"
        >
          <Sun size={20} />
        </button>
      </div>
    </>
  );
};

export default Header;
