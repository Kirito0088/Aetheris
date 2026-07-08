import React from "react";
import clsx from "clsx";

interface ContentContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isFullWidth?: boolean; // For Living Digital Twin
}

export function ContentContainer({ 
  children, 
  isFullWidth = false,
  className,
  ...props 
}: ContentContainerProps) {
  return (
    <main 
      className={clsx(
        "flex-1 overflow-y-auto w-full",
        !isFullWidth && "max-w-7xl mx-auto p-8",
        isFullWidth && "p-0 h-full",
        className
      )}
      {...props}
    >
      {children}
    </main>
  );
}
