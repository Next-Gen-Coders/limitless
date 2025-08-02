import React from "react";

interface MobileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const MobileOverlay: React.FC<MobileOverlayProps> = ({
  isOpen,
  onClose,
  className = "",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-40 lg:hidden ${className}`}
      onClick={onClose}
    />
  );
};

export default MobileOverlay;
