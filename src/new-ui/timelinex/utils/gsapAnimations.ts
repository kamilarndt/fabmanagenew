/**
 * GSAP Animation Utilities for TimelineX
 * Provides smooth, performant animations for timeline interactions
 */

// GSAP types (we'll install the actual package later)
export interface GSAPTimeline {
  to(targets: any, vars: any, position?: any): GSAPTimeline;
  from(targets: any, vars: any, position?: any): GSAPTimeline;
  fromTo(targets: any, fromVars: any, toVars: any, position?: any): GSAPTimeline;
  set(targets: any, vars: any, position?: any): GSAPTimeline;
  call(callback: () => void, params?: any[], position?: any): GSAPTimeline;
  play(position?: any): GSAPTimeline;
  pause(position?: any): GSAPTimeline;
  reverse(position?: any): GSAPTimeline;
  restart(includeDelay?: boolean, suppressEvents?: boolean): GSAPTimeline;
  seek(position: any, suppressEvents?: boolean): GSAPTimeline;
  timeScale(value: number): GSAPTimeline;
  duration(): number;
  progress(value?: number): number;
  kill(): void;
}

export interface GSAPAnimationVars {
  duration?: number;
  delay?: number;
  ease?: string | Function;
  x?: number | string;
  y?: number | string;
  scale?: number;
  rotation?: number;
  opacity?: number;
  backgroundColor?: string;
  color?: string;
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  boxShadow?: string;
  transform?: string;
  onStart?: () => void;
  onComplete?: () => void;
  onUpdate?: () => void;
  onReverseComplete?: () => void;
}

export interface TimelineAnimationConfig {
  duration: number;
  ease: string;
  stagger: number;
  delay: number;
}

export interface ItemAnimationConfig {
  enter: GSAPAnimationVars;
  exit: GSAPAnimationVars;
  hover: GSAPAnimationVars;
  select: GSAPAnimationVars;
  drag: GSAPAnimationVars;
  resize: GSAPAnimationVars;
}

export interface ViewportAnimationConfig {
  zoom: GSAPAnimationVars;
  pan: GSAPAnimationVars;
  fit: GSAPAnimationVars;
  reset: GSAPAnimationVars;
}

// Animation presets
export const ANIMATION_PRESETS = {
  // Item animations
  itemEnter: {
    duration: 0.3,
    ease: "back.out(1.7)",
    from: { scale: 0, opacity: 0, y: -20 },
    to: { scale: 1, opacity: 1, y: 0 },
  },
  
  itemExit: {
    duration: 0.2,
    ease: "power2.in",
    to: { scale: 0, opacity: 0, y: -20 },
  },
  
  itemHover: {
    duration: 0.15,
    ease: "power2.out",
    to: { scale: 1.05, y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },
  },
  
  itemSelect: {
    duration: 0.2,
    ease: "power2.out",
    to: { scale: 1.02, boxShadow: "0 0 0 3px rgba(24, 144, 255, 0.3)" },
  },
  
  itemDrag: {
    duration: 0.1,
    ease: "power2.out",
    to: { scale: 1.1, rotation: 2, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" },
  },
  
  // Viewport animations
  viewportZoom: {
    duration: 0.4,
    ease: "power2.inOut",
  },
  
  viewportPan: {
    duration: 0.3,
    ease: "power2.out",
  },
  
  viewportFit: {
    duration: 0.6,
    ease: "power2.inOut",
  },
  
  // Group animations
  groupExpand: {
    duration: 0.3,
    ease: "power2.out",
    to: { height: "auto", opacity: 1 },
  },
  
  groupCollapse: {
    duration: 0.2,
    ease: "power2.in",
    to: { height: 0, opacity: 0 },
  },
  
  // Timeline animations
  timelineLoad: {
    duration: 0.5,
    ease: "power2.out",
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
  },
  
  timelineUpdate: {
    duration: 0.3,
    ease: "power2.out",
    to: { scale: 1.02 },
    onComplete: () => {
      // Reset scale after animation
      // This would be handled by GSAP
    },
  },
} as const;

// Animation manager class
export class TimelineAnimationManager {
  private timelines: Map<string, GSAPTimeline> = new Map();
  private isGSAPAvailable: boolean = false;

  constructor() {
    this.checkGSAPAvailability();
  }

  private checkGSAPAvailability(): void {
    // Check if GSAP is available
    this.isGSAPAvailable = typeof window !== 'undefined' && 'gsap' in window;
  }

  private getGSAP(): any {
    if (typeof window !== 'undefined' && 'gsap' in window) {
      return (window as any).gsap;
    }
    return null;
  }

  // Create timeline
  createTimeline(id: string): GSAPTimeline | null {
    if (!this.isGSAPAvailable) return null;
    
    const gsap = this.getGSAP();
    if (!gsap) return null;

    const timeline = gsap.timeline();
    this.timelines.set(id, timeline);
    return timeline;
  }

  // Get timeline
  getTimeline(id: string): GSAPTimeline | null {
    return this.timelines.get(id) || null;
  }

  // Kill timeline
  killTimeline(id: string): void {
    const timeline = this.timelines.get(id);
    if (timeline) {
      timeline.kill();
      this.timelines.delete(id);
    }
  }

  // Kill all timelines
  killAllTimelines(): void {
    this.timelines.forEach(timeline => timeline.kill());
    this.timelines.clear();
  }

  // Animate item enter
  animateItemEnter(element: HTMLElement, config: Partial<GSAPAnimationVars> = {}): void {
    if (!this.isGSAPAvailable) return;

    const gsap = this.getGSAP();
    if (!gsap) return;

    const preset = ANIMATION_PRESETS.itemEnter;
    gsap.fromTo(element, preset.from, {
      ...preset.to,
      duration: preset.duration,
      ease: preset.ease,
      ...config,
    });
  }

  // Animate item exit
  animateItemExit(element: HTMLElement, config: Partial<GSAPAnimationVars> = {}): void {
    if (!this.isGSAPAvailable) return;

    const gsap = this.getGSAP();
    if (!gsap) return;

    const preset = ANIMATION_PRESETS.itemExit;
    gsap.to(element, {
      ...preset.to,
      duration: preset.duration,
      ease: preset.ease,
      ...config,
    });
  }

  // Animate item hover
  animateItemHover(element: HTMLElement, isHovered: boolean, config: Partial<GSAPAnimationVars> = {}): void {
    if (!this.isGSAPAvailable) return;

    const gsap = this.getGSAP();
    if (!gsap) return;

    const preset = ANIMATION_PRESETS.itemHover;
    if (isHovered) {
      gsap.to(element, {
        ...preset.to,
        duration: preset.duration,
        ease: preset.ease,
        ...config,
      });
    } else {
      gsap.to(element, {
        scale: 1,
        y: 0,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        duration: preset.duration,
        ease: preset.ease,
        ...config,
      });
    }
  }

  // Animate item selection
  animateItemSelect(element: HTMLElement, isSelected: boolean, config: Partial<GSAPAnimationVars> = {}): void {
    if (!this.isGSAPAvailable) return;

    const gsap = this.getGSAP();
    if (!gsap) return;

    const preset = ANIMATION_PRESETS.itemSelect;
    if (isSelected) {
      gsap.to(element, {
        ...preset.to,
        duration: preset.duration,
        ease: preset.ease,
        ...config,
      });
    } else {
      gsap.to(element, {
        scale: 1,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        duration: preset.duration,
        ease: preset.ease,
        ...config,
      });
    }
  }

  // Animate viewport zoom
  animateViewportZoom(container: HTMLElement, zoom: number, center: { x: number; y: number }, config: Partial<GSAPAnimationVars> = {}): void {
    if (!this.isGSAPAvailable) return;

    const gsap = this.getGSAP();
    if (!gsap) return;

    const preset = ANIMATION_PRESETS.viewportZoom;
    gsap.to(container, {
      scale: zoom,
      transformOrigin: `${center.x}px ${center.y}px`,
      duration: preset.duration,
      ease: preset.ease,
      ...config,
    });
  }

  // Animate viewport pan
  animateViewportPan(container: HTMLElement, delta: { x: number; y: number }, config: Partial<GSAPAnimationVars> = {}): void {
    if (!this.isGSAPAvailable) return;

    const gsap = this.getGSAP();
    if (!gsap) return;

    const preset = ANIMATION_PRESETS.viewportPan;
    gsap.to(container, {
      x: delta.x,
      y: delta.y,
      duration: preset.duration,
      ease: preset.ease,
      ...config,
    });
  }

  // Animate timeline load
  animateTimelineLoad(container: HTMLElement, config: Partial<GSAPAnimationVars> = {}): void {
    if (!this.isGSAPAvailable) return;

    const gsap = this.getGSAP();
    if (!gsap) return;

    const preset = ANIMATION_PRESETS.timelineLoad;
    gsap.fromTo(container, preset.from, {
      ...preset.to,
      duration: preset.duration,
      ease: preset.ease,
      ...config,
    });
  }

  // Stagger animation for multiple items
  staggerItems(items: HTMLElement[], animation: GSAPAnimationVars, stagger: number = 0.1): void {
    if (!this.isGSAPAvailable) return;

    const gsap = this.getGSAP();
    if (!gsap) return;

    gsap.fromTo(items, animation, {
      ...animation,
      stagger,
    });
  }

  // Create morphing animation between states
  morphItem(element: HTMLElement, fromState: any, toState: any, config: Partial<GSAPAnimationVars> = {}): void {
    if (!this.isGSAPAvailable) return;

    const gsap = this.getGSAP();
    if (!gsap) return;

    gsap.fromTo(element, fromState, {
      ...toState,
      duration: 0.3,
      ease: "power2.inOut",
      ...config,
    });
  }

  // Create timeline sequence
  createSequence(id: string, animations: Array<{ target: any; vars: GSAPAnimationVars; position?: any }>): GSAPTimeline | null {
    const timeline = this.createTimeline(id);
    if (!timeline) return null;

    animations.forEach(({ target, vars, position }) => {
      timeline.to(target, vars, position);
    });

    return timeline;
  }

  // Pause all animations
  pauseAll(): void {
    this.timelines.forEach(timeline => timeline.pause());
  }

  // Resume all animations
  resumeAll(): void {
    this.timelines.forEach(timeline => timeline.play());
  }

  // Set global time scale
  setTimeScale(scale: number): void {
    this.timelines.forEach(timeline => timeline.timeScale(scale));
  }

  // Get animation progress
  getProgress(timelineId: string): number {
    const timeline = this.timelines.get(timelineId);
    return timeline ? timeline.progress() : 0;
  }

  // Check if GSAP is available
  isAvailable(): boolean {
    return this.isGSAPAvailable;
  }
}

// Global animation manager instance
let globalAnimationManager: TimelineAnimationManager | null = null;

export function getAnimationManager(): TimelineAnimationManager {
  if (!globalAnimationManager) {
    globalAnimationManager = new TimelineAnimationManager();
  }
  return globalAnimationManager;
}

// Utility functions
export function createEaseFunction(ease: string): string {
  // Return GSAP ease string
  return ease;
}

export function createStaggerDelay(index: number, stagger: number): number {
  return index * stagger;
}

export function createAnimationConfig(
  duration: number = 0.3,
  ease: string = "power2.out",
  delay: number = 0
): GSAPAnimationVars {
  return {
    duration,
    ease,
    delay,
  };
}

// Animation hooks for React
export function useTimelineAnimation() {
  const animationManager = getAnimationManager();
  
  return {
    animateItemEnter: animationManager.animateItemEnter.bind(animationManager),
    animateItemExit: animationManager.animateItemExit.bind(animationManager),
    animateItemHover: animationManager.animateItemHover.bind(animationManager),
    animateItemSelect: animationManager.animateItemSelect.bind(animationManager),
    animateViewportZoom: animationManager.animateViewportZoom.bind(animationManager),
    animateViewportPan: animationManager.animateViewportPan.bind(animationManager),
    animateTimelineLoad: animationManager.animateTimelineLoad.bind(animationManager),
    staggerItems: animationManager.staggerItems.bind(animationManager),
    morphItem: animationManager.morphItem.bind(animationManager),
    createSequence: animationManager.createSequence.bind(animationManager),
    isAvailable: animationManager.isAvailable.bind(animationManager),
  };
}
