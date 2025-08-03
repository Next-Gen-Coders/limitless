import React from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "./button";

interface SidebarNavItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  isCollapsed?: boolean;
  visible?: boolean;
  onClick?: () => void;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  icon: Icon,
  label,
  active = false,
  isCollapsed = false,
  visible = true,
  onClick,
}) => {
  if (!visible) return null;

  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className={`w-full ${active
        ? "bg-sidebar-accent text-sidebar-accent-foreground"
        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        } ${isCollapsed ? "justify-center" : "justify-start"}`}
      onClick={onClick}
    >
      <Icon size={16} />
      {!isCollapsed && label}
    </Button>
  );
};

export default SidebarNavItem;
