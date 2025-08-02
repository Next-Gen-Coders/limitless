import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  size = "md",
  showText = true,
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <img
        src="/logo.png"
        alt="Limitless"
        className={`${sizeClasses[size]} w-fit dark:invert`}
      />
      {showText && (
        <span
          className={`font-bold text-foreground font-family-zilla ${textSizes[size]}`}
        >
          Limitless
        </span>
      )}
    </div>
  );
};

export default Logo;
