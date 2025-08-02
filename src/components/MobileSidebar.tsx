import React from "react";
import { X } from "lucide-react";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-gray-900 z-50 md:hidden flex flex-col shadow-xl">
        <div className="p-4 h-full">
          {/* Header with close button */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-white text-xl font-bold">limitless</h1>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 mb-6">
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors">
              <span className="text-lg">+</span>
              <span>New Chat</span>
            </button>

            <button className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-700 transition-colors">
              <span className="text-lg">💬</span>
              <span>Saved Chats</span>
            </button>
          </div>

          {/* Chats section */}
          <div className="flex-1">
            <h3 className="text-white font-medium mb-3">Chats</h3>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Q Search"
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="text-gray-400 text-sm text-center py-8">
              No chats yet. Start a conversation!
            </div>
          </div>

          {/* Support section */}
          <div className="border-t border-gray-800 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">support</span>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <span className="text-lg">🐦</span>
                </button>
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <span className="text-lg">💬</span>
                </button>
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <span className="text-lg">⏰</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
