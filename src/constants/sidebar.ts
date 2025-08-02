import { Home, Wallet, MessageSquare, Settings } from "lucide-react";

export const navigationItems = [
  { icon: Home, label: "Dashboard", active: true },
  { icon: Wallet, label: "Wallets", active: false },
  { icon: MessageSquare, label: "Chats", active: false },
  { icon: Settings, label: "Settings", active: false },
];

export const recentChats = [
  { id: 1, title: "Portfolio Analysis", time: "2 min ago" },
  { id: 2, title: "Token Swap", time: "1 hour ago" },
  { id: 3, title: "Market Research", time: "3 hours ago" },
];
