import React from "react";
import Link from "next/link";
import { clsx } from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "accent" | "ink" | "navy" | "white" | "ghost";
  href?: string;
  showArrow?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "accent", href, showArrow = false, children, ...props }, ref) => {
    const variantClass = {
      accent: "btn",
      ink: "btn ink",
      navy: "btn navy",
      white: "btn white",
      ghost: "btn ghost",
    }[variant];

    const content = (
      <>
        <span>{children}</span>
        {showArrow && <span className="ar">→</span>}
      </>
    );

    if (href) {
      return (
        <Link href={href} className={clsx(variantClass, className)}>
          {content}
        </Link>
      );
    }

    return (
      <button ref={ref} className={clsx(variantClass, className)} {...props}>
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

