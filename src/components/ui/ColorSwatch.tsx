import React from "react";
import { clsx } from "clsx";

export interface ColorSwatchProps {
  color: string;
  name: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color,
  name,
  selected = false,
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      title={name}
      aria-label={name}
      aria-pressed={selected}
      onClick={onClick}
      style={{ backgroundColor: color }}
      className={clsx(
        "w-11 h-11 rounded-full border-[3px] border-[#FFFFFF] outline outline-2 outline-[#3A3A3A] cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95",
        selected && "!outline-[3px] !outline-[#111111] scale-110",
        className
      )}
    />
  );
};

