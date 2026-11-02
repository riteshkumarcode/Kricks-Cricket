import React from "react";

interface AdminPageHeaderProps {
  kicker?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  kicker,
  title,
  description,
  children,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 mb-6 border-b border-[#E6E3DE]">
      <div>
        {kicker && (
          <span className="text-xs uppercase tracking-widest font-display text-accent block mb-1">
            {kicker}
          </span>
        )}
        <h1 className="font-display text-3xl md:text-4xl uppercase tracking-wider text-ink leading-none">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-ink-muted mt-1.5 font-body">{description}</p>
        )}
      </div>

      {children && (
        <div className="flex flex-wrap items-center gap-3">{children}</div>
      )}
    </div>
  );
};

