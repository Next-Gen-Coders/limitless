import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

const AppPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center relative">
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-lg transition-colors duration-200 hover:bg-accent"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-foreground" />
        ) : (
          <Moon className="w-5 h-5 text-foreground" />
        )}
      </button>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 font-family-zilla text-foreground">
          Welcome to App
        </h1>
        <p className="text-muted-foreground">
          This is the app page. More features coming soon!
        </p>
      </div>
    </div>
  );
};

export default AppPage;
