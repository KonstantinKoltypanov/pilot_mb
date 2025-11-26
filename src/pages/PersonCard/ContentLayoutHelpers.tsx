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
        width: "100%",
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
        borderTop: "solid 1px #f0f0f0",
        height: "40px",
        paddingLeft: 24,
      }}
    >
      {children}
    </div>
  );
};
