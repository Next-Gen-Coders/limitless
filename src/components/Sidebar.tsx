import React, { useState } from "react";
import {
  Plus,
  MessageSquare,
  Search,
  Twitter,
  MessageCircle,
  Clock,
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div
      className={`bg-gray-900 border-r border-gray-800 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } flex flex-col h-full md:flex`}
    >
      {/* Toggle button */}
      <div className="p-4 border-b border-gray-800">
        <button
          onClick={onToggle}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Action buttons */}
      <div className="p-4 space-y-3">
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors">
          <Plus size={16} />
          {!isCollapsed && <span>New Chat</span>}
        </button>

        <button className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-700 transition-colors">
          <MessageSquare size={16} />
          {!isCollapsed && <span>Saved Chats</span>}
        </button>
      </div>

      {/* Chats section */}
      <div className="flex-1 p-4">
        {!isCollapsed && (
          <>
            <h3 className="text-white font-medium mb-3">Chats</h3>
            <div className="relative mb-4">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Q Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 text-white px-10 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="text-gray-400 text-sm text-center py-8">
              No chats yet. Start a conversation!
            </div>
          </>
        )}
      </div>

      {/* Support section */}
      <div className="p-4 border-t border-gray-800">
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">support</span>
            <div className="flex space-x-2">
              <button className="p-1 text-gray-400 hover:text-white transition-colors">
                <Twitter size={16} />
              </button>
              <button className="p-1 text-gray-400 hover:text-white transition-colors">
                <MessageCircle size={16} />
              </button>
              <button className="p-1 text-gray-400 hover:text-white transition-colors">
                <Clock size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            <button className="p-1 text-gray-400 hover:text-white transition-colors">
              <Twitter size={16} />
            </button>
            <button className="p-1 text-gray-400 hover:text-white transition-colors">
              <MessageCircle size={16} />
            </button>
            <button className="p-1 text-gray-400 hover:text-white transition-colors">
              <Clock size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
