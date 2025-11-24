import React from "react";

interface ContentLayoutBodyProps {
  children?: React.ReactNode;
}

export const ContentLayoutBody: React.FC<ContentLayoutBodyProps> = ({
  children,
}) => {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 60,
        padding: 24,
        overflow: "auto",
      }}
    >
      {children}
    </div>
  );
};

interface ContentLayoutFooterProps {
  children?: React.ReactNode;
}

export const ContentLayoutFooter: React.FC<ContentLayoutFooterProps> = ({
  children,
}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "40px",
      }}
    >
      {children}
    </div>
  );
};
