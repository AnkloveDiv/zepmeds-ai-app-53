
import React from "react";

interface UtensilsProps {
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const Utensils = ({
  className,
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: UtensilsProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z" />
      <path d="M18 22v-3" />
    </svg>
  );
};

export default Utensils;
