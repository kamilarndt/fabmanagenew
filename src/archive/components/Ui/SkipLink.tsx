import React from "react";

interface SkipLinkProps {
  href: string;
  children: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({ href, children }) => (
  <a
    href={href}
    style={{
      position: "absolute",
      top: "-40px",
      left: "6px",
      background: "var(--color-brand-primary)",
      color: "white",
      padding: "8px",
      textDecoration: "none",
      zIndex: 9999,
      borderRadius: "4px",
      fontSize: "14px",
      fontWeight: 600,
    }}
    onFocus={(e) => {
      e.currentTarget.style.top = "6px";
    }}
    onBlur={(e) => {
      e.currentTarget.style.top = "-40px";
    }}
    data-testid="skip-link"
  >
    {children}
  </a>
);

export const AppWithSkipLinks: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <>
    <SkipLink href="#main-content">Przejdź do głównej treści</SkipLink>
    <SkipLink href="#navigation">Przejdź do nawigacji</SkipLink>
    {children}
  </>
);
