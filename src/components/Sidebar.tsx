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
import { ScrollArea } from "./ui/scroll-area";
import SidebarNavItem from "./ui/sidebar-nav-item";
import ChatItem from "./ui/chat-item";
import Logo from "./ui/logo";
import MobileOverlay from "./ui/mobile-overlay";
import { navigationItems, recentChats } from "../constants/sidebar";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  isMobile,
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const sidebarContent = (
    <div
      className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
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
          className={`w-full dark:bg-white dark:text-black text-white bg-black hover:bg-sidebar-primary/90 ${
            isCollapsed ? "justify-center" : "justify-start"
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
                Recent Chats
              </h3>
              <ScrollArea className="h-[300px]">
                {recentChats.map((chat) => (
                  <ChatItem key={chat.id} title={chat.title} time={chat.time} />
                ))}
              </ScrollArea>
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
          className={`fixed top-0 left-0 h-full z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
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
