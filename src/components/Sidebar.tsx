import React, { useState } from "react";
import {
  Plus,
  Search,
  Twitter,
  MessageCircle,
  Clock,
  Menu,
  User,
  PanelLeft,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import SidebarNavItem from "./ui/sidebar-nav-item";
import Logo from "./ui/logo";
import MobileOverlay from "./ui/mobile-overlay";
import { navigationItems } from "../constants/sidebar";
import { useGetUserChats } from "../hooks/services/useChat";
import { useUserId } from "../stores/userStore";
import type { Chat } from "../types/api";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
  onChatSelect?: (chatId: string) => void;
  onNewChat?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  isMobile,
  isOpen,
  onClose,
  onChatSelect,
  onNewChat,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Get current user ID from Zustand store
  const userId = useUserId();

  // Fetch user chats
  const {
    data: userChatsResponse,
    isLoading: isLoadingChats,
    error: chatsError
  } = useGetUserChats(userId || "", !!userId);

  // Extract the chats array from the API response
  const userChats = React.useMemo(() => userChatsResponse?.data || [], [userChatsResponse]);

  // Debug log to understand the structure
  React.useEffect(() => {
    if (userChatsResponse) {
      console.log("userChatsResponse:", userChatsResponse);
      console.log("extracted userChats:", userChats);
      console.log("userChats length:", userChats.length);
    }
  }, [userChatsResponse, userChats]);

  // Filter chats based on search query
  const filteredChats = userChats.filter((chat: Chat) =>
    chat.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChat = () => {
    if (onNewChat) {
      onNewChat();
    }
    if (isMobile) {
      onClose();
    }
  };

  const handleChatClick = (chatId: string) => {
    if (onChatSelect) {
      onChatSelect(chatId);
    }
    if (isMobile) {
      onClose();
    }
  };

  const sidebarContent = (
    <div
      className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"
        } flex flex-col h-full`}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && <Logo size="md" />}
          <Button
            variant="ghost"
            size="sm"
            onClick={isMobile ? onClose : onToggle}
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {isMobile ? (
              <X size={20} />
            ) : isCollapsed ? (
              <Menu size={20} />
            ) : (
              <PanelLeft size={20} />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-2">
        <Button
          onClick={handleNewChat}
          className={`w-full dark:bg-white dark:text-black text-white bg-black hover:bg-sidebar-primary/90 ${isCollapsed ? "justify-center" : "justify-start"
            }`}
        >
          <Plus size={16} />
          {!isCollapsed && "New Chat"}
        </Button>

        {navigationItems.map((item, index) => (
          <SidebarNavItem
            key={index}
            icon={item.icon}
            label={item.label}
            active={item.active}
            visible={item.visible}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Search and Chats */}
      <div className="flex-1 p-4">
        {!isCollapsed && (
          <>
            <div className="relative mb-4">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <Input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground placeholder:text-muted-foreground focus:border-sidebar-ring"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-sidebar-foreground mb-3">
                Your Chats
              </h3>

              {isLoadingChats ? (
                <div className="text-muted-foreground text-sm text-center py-4">
                  Loading chats...
                </div>
              ) : chatsError ? (
                <div className="text-red-500 text-sm text-center py-4">
                  Error loading chats: {chatsError.message}
                </div>
              ) : filteredChats.length > 0 ? (
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {filteredChats.map((chat: Chat) => (
                    <button
                      key={chat.id}
                      onClick={() => handleChatClick(chat.id)}
                      className="w-full text-left p-2 rounded-md hover:bg-sidebar-accent/50 transition-colors group"
                    >
                      <div className="text-sm text-sidebar-foreground truncate">
                        {chat.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(chat.updatedAt).toLocaleDateString()}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground text-sm text-center py-8">
                  {searchQuery ? "No chats found" : "No chats yet"}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Footer */}
      <div className="p-4">
        {!isCollapsed ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <User size={16} className="text-muted-foreground" />
              <span className="text-sm text-sidebar-foreground">Account</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Support</span>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <Twitter size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <MessageCircle size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <Clock size={14} />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-auto text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <User size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-auto text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Twitter size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-auto text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <MessageCircle size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <MobileOverlay isOpen={isOpen} onClose={onClose} />

        <div
          className={`fixed top-0 left-0 h-full z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  return sidebarContent;
};

export default Sidebar;
