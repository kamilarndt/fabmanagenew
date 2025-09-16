/**
 * Animation utilities for the new UI system
 */

export const animations = {
  // Fade animations
  fadeIn: "tw-animate-in tw-fade-in-0",
  fadeOut: "tw-animate-out tw-fade-out-0",

  // Slide animations
  slideInFromTop: "tw-animate-in tw-slide-in-from-top-2",
  slideInFromBottom: "tw-animate-in tw-slide-in-from-bottom-2",
  slideInFromLeft: "tw-animate-in tw-slide-in-from-left-2",
  slideInFromRight: "tw-animate-in tw-slide-in-from-right-2",

  slideOutToTop: "tw-animate-out tw-slide-out-to-top-2",
  slideOutToBottom: "tw-animate-out tw-slide-out-to-bottom-2",
  slideOutToLeft: "tw-animate-out tw-slide-out-to-left-2",
  slideOutToRight: "tw-animate-out tw-slide-out-to-right-2",

  // Zoom animations
  zoomIn: "tw-animate-in tw-zoom-in-95",
  zoomOut: "tw-animate-out tw-zoom-out-95",

  // Scale animations
  scaleIn: "tw-animate-in tw-zoom-in-90",
  scaleOut: "tw-animate-out tw-zoom-out-90",

  // Duration classes
  duration: {
    fast: "tw-duration-150",
    normal: "tw-duration-200",
    slow: "tw-duration-300",
    slower: "tw-duration-500",
  },

  // Easing classes
  easing: {
    linear: "tw-ease-linear",
    in: "tw-ease-in",
    out: "tw-ease-out",
    inOut: "tw-ease-in-out",
  },
} as const;

export type AnimationType = keyof typeof animations;
export type DurationType = keyof typeof animations.duration;
export type EasingType = keyof typeof animations.easing;

/**
 * Combine animation classes with duration and easing
 */
export function getAnimationClasses(
  animation: AnimationType,
  duration: DurationType = "normal",
  easing: EasingType = "out"
): string {
  return `${animations[animation]} ${animations.duration[duration]} ${animations.easing[easing]}`;
}

/**
 * Common animation presets
 */
export const animationPresets = {
  modal: getAnimationClasses("zoomIn", "normal", "out"),
  dropdown: getAnimationClasses("slideInFromTop", "fast", "out"),
  tooltip: getAnimationClasses("fadeIn", "fast", "out"),
  sheet: getAnimationClasses("slideInFromRight", "normal", "out"),
  toast: getAnimationClasses("slideInFromTop", "fast", "out"),
} as const;
