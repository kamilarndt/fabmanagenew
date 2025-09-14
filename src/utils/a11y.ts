// Screen Reader Only utility
export const srOnly: React.CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: "0",
};

// Focus ring utility
export const focusRing: React.CSSProperties = {
  outline: "2px solid var(--color-brand-primary)",
  outlineOffset: "2px",
  borderRadius: "4px",
};

// Announce to screen readers
export const announce = (
  message: string,
  priority: "polite" | "assertive" = "polite"
) => {
  const announcer = document.createElement("div");
  announcer.setAttribute("aria-live", priority);
  announcer.setAttribute("aria-atomic", "true");
  Object.assign(announcer.style, srOnly);
  document.body.appendChild(announcer);
  announcer.textContent = message;
  setTimeout(() => document.body.removeChild(announcer), 1000);
};

// Keyboard navigation helpers
export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
  );
  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[
    focusableElements.length - 1
  ] as HTMLElement;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };

  element.addEventListener("keydown", handleKeyDown);
  firstFocusable?.focus();

  return () => element.removeEventListener("keydown", handleKeyDown);
};
