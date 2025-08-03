import { Home, Wallet, MessageSquare, Settings } from "lucide-react";

export const navigationItems = [
  { icon: Home, label: "Dashboard", active: false, visible: false },
  { icon: MessageSquare, label: "Chats", active: true, visible: false },
  { icon: Wallet, label: "Wallets", active: false, visible: true },
  { icon: Settings, label: "Settings", active: false, visible: false },
];
