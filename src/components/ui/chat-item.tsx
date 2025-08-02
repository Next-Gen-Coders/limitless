import React from "react";
import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "./card";

interface ChatItemProps {
  title: string;
  time: string;
  onClick?: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ title, time, onClick }) => {
  return (
    <Card
      className="mb-2 bg-sidebar-accent/30 border-sidebar-border hover:bg-sidebar-accent/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare size={14} className="text-muted-foreground" />
            <span className="text-sm text-sidebar-foreground font-medium">
              {title}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatItem;
