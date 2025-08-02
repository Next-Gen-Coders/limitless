import React from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "./button";
import { useTheme } from "../../contexts/ThemeContext";

interface ThemeToggleProps {
  variant?: "default" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = "ghost",
  size = "sm",
  className = "",
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={`text-foreground hover:bg-accent ${className}`}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </Button>
  );
};

export default ThemeToggle;
