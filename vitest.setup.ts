import "@testing-library/jest-dom";

// antd responsive hooks expect matchMedia
if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// rc-table calls getComputedStyle, provide minimal mock
if (!window.getComputedStyle) {
  // @ts-expect-error jsdom type
  window.getComputedStyle = () => ({ getPropertyValue: () => "" });
}
