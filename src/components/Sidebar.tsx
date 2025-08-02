import React, { useState } from "react";
import {
  Plus,
  MessageSquare,
  Search,
  Twitter,
  MessageCircle,
  Clock,
  Menu,
    Settings,
  User,
  Home,
  Wallet,
  PanelLeft
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigationItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: Wallet, label: "Wallets", active: false },
    { icon: MessageSquare, label: "Chats", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  const recentChats = [
    { id: 1, title: "Portfolio Analysis", time: "2 min ago" },
    { id: 2, title: "Token Swap", time: "1 hour ago" },
    { id: 3, title: "Market Research", time: "3 hours ago" },
  ];

  return (
    <div
      className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } flex flex-col h-full`}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="Limitless"
                className="h-8 w-fit dark:invert"
              />
              <span className="text-lg font-bold text-sidebar-foreground font-family-zilla">
                Limitless
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {isCollapsed ? <Menu size={20} /> : <PanelLeft size={20} />}
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
          <Button
            key={index}
            variant={item.active ? "secondary" : "ghost"}
            className={`w-full ${
              item.active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            } ${isCollapsed ? "justify-center" : "justify-start"}`}
          >
            <item.icon size={16} />
            {!isCollapsed && item.label}
          </Button>
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
                  <Card
                    key={chat.id}
                    className="mb-2 bg-sidebar-accent/30 border-sidebar-border hover:bg-sidebar-accent/50 transition-colors cursor-pointer"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MessageSquare
                            size={14}
                            className="text-muted-foreground"
                          />
                          <span className="text-sm text-sidebar-foreground font-medium">
                            {chat.title}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {chat.time}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
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
};

export default Sidebar;
