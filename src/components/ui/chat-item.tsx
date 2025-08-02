import React from "react";
import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "./card";

interface ChatItemProps {
  title: string;
  time: string;
  onClick?: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ title, onClick }) => {
  return (
    <Card
      className="mb-2 bg-sidebar-accent/30 border-sidebar-border hover:bg-sidebar-accent/50 transition-colors cursor-pointer p-0"
      onClick={onClick}
    >
      <CardContent className="p-2 rounded-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 space-x-2">
            <MessageSquare size={14} className="text-muted-foreground" />
            <span className="text-sm text-sidebar-foreground font-medium truncate ">
              {title}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatItem;
