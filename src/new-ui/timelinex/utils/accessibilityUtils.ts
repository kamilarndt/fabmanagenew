/**
 * Accessibility Utilities for TimelineX
 * Provides WCAG 2.1 AA compliance features and accessibility helpers
 */

export interface AccessibilityOptions {
  enableKeyboardNavigation: boolean;
  enableScreenReaderSupport: boolean;
  enableHighContrast: boolean;
  enableReducedMotion: boolean;
  enableFocusManagement: boolean;
  enableARIALabels: boolean;
  enableLiveRegions: boolean;
  enableSkipLinks: boolean;
  enableColorBlindSupport: boolean;
  enableVoiceControl: boolean;
}

export interface AccessibilityState {
  isKeyboardFocused: boolean;
  focusedElement: HTMLElement | null;
  currentAnnouncement: string | null;
  isHighContrast: boolean;
  isReducedMotion: boolean;
  isScreenReaderActive: boolean;
  currentFocusIndex: number;
  totalFocusableElements: number;
}

export class AccessibilityManager {
  private options: AccessibilityOptions;
  private state: AccessibilityState;
  private focusableElements: HTMLElement[] = [];
  private observers: Map<string, MutationObserver> = new Map();

  constructor(options: Partial<AccessibilityOptions> = {}) {
    this.options = {
      enableKeyboardNavigation: true,
      enableScreenReaderSupport: true,
      enableHighContrast: true,
      enableReducedMotion: true,
      enableFocusManagement: true,
      enableARIALabels: true,
      enableLiveRegions: true,
      enableSkipLinks: true,
      enableColorBlindSupport: true,
      enableVoiceControl: true,
      ...options,
    };

    this.state = {
      isKeyboardFocused: false,
      focusedElement: null,
      currentAnnouncement: null,
      isHighContrast: false,
      isReducedMotion: false,
      isScreenReaderActive: false,
      currentFocusIndex: 0,
      totalFocusableElements: 0,
    };

    this.initialize();
  }

  private initialize(): void {
    this.detectHighContrast();
    this.detectReducedMotion();
    this.detectScreenReader();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupLiveRegions();
  }

  private detectHighContrast(): void {
    if (!this.options.enableHighContrast) return;

    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    this.state.isHighContrast = mediaQuery.matches;

    mediaQuery.addEventListener('change', (e) => {
      this.state.isHighContrast = e.matches;
      this.updateHighContrastStyles();
    });
  }

  private detectReducedMotion(): void {
    if (!this.options.enableReducedMotion) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.state.isReducedMotion = mediaQuery.matches;

    mediaQuery.addEventListener('change', (e) => {
      this.state.isReducedMotion = e.matches;
      this.updateReducedMotionStyles();
    });
  }

  private detectScreenReader(): void {
    if (!this.options.enableScreenReaderSupport) return;

    // Simple screen reader detection
    this.state.isScreenReaderActive = 
      navigator.userAgent.includes('NVDA') ||
      navigator.userAgent.includes('JAWS') ||
      navigator.userAgent.includes('VoiceOver') ||
      window.speechSynthesis?.speaking;
  }

  private setupKeyboardNavigation(): void {
    if (!this.options.enableKeyboardNavigation) return;

    document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
  }

  private setupFocusManagement(): void {
    if (!this.options.enableFocusManagement) return;

    document.addEventListener('focusin', this.handleFocusIn.bind(this));
    document.addEventListener('focusout', this.handleFocusOut.bind(this));
  }

  private setupLiveRegions(): void {
    if (!this.options.enableLiveRegions) return;

    // Create live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'timeline-live-region';
    liveRegion.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    document.body.appendChild(liveRegion);
  }

  private handleKeyboardNavigation(event: KeyboardEvent): void {
    if (!this.state.isKeyboardFocused) return;

    switch (event.key) {
      case 'Tab':
        this.handleTabNavigation(event);
        break;
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        this.handleArrowNavigation(event);
        break;
      case 'Enter':
      case ' ':
        this.handleActivation(event);
        break;
      case 'Escape':
        this.handleEscape(event);
        break;
      case 'Home':
        this.handleHome(event);
        break;
      case 'End':
        this.handleEnd(event);
        break;
    }
  }

  private handleTabNavigation(event: KeyboardEvent): void {
    event.preventDefault();
    this.moveFocus(event.shiftKey ? -1 : 1);
  }

  private handleArrowNavigation(event: KeyboardEvent): void {
    event.preventDefault();
    const direction = event.key.replace('Arrow', '').toLowerCase();
    this.moveFocusInDirection(direction);
  }

  private handleActivation(event: KeyboardEvent): void {
    event.preventDefault();
    if (this.state.focusedElement) {
      this.state.focusedElement.click();
    }
  }

  private handleEscape(event: KeyboardEvent): void {
    event.preventDefault();
    this.clearFocus();
  }

  private handleHome(event: KeyboardEvent): void {
    event.preventDefault();
    this.moveFocusToFirst();
  }

  private handleEnd(event: KeyboardEvent): void {
    event.preventDefault();
    this.moveFocusToLast();
  }

  private handleFocusIn(event: FocusEvent): void {
    this.state.isKeyboardFocused = true;
    this.state.focusedElement = event.target as HTMLElement;
    this.updateFocusIndex();
  }

  private handleFocusOut(event: FocusEvent): void {
    this.state.isKeyboardFocused = false;
    this.state.focusedElement = null;
  }

  private moveFocus(direction: number): void {
    const newIndex = this.state.currentFocusIndex + direction;
    if (newIndex >= 0 && newIndex < this.focusableElements.length) {
      this.state.currentFocusIndex = newIndex;
      this.focusableElements[newIndex].focus();
    }
  }

  private moveFocusInDirection(direction: string): void {
    // Implement directional focus movement based on timeline layout
    const currentElement = this.focusableElements[this.state.currentFocusIndex];
    if (!currentElement) return;

    const rect = currentElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let targetElement: HTMLElement | null = null;

    switch (direction) {
      case 'up':
        targetElement = this.findElementAbove(centerX, centerY);
        break;
      case 'down':
        targetElement = this.findElementBelow(centerX, centerY);
        break;
      case 'left':
        targetElement = this.findElementLeft(centerX, centerY);
        break;
      case 'right':
        targetElement = this.findElementRight(centerX, centerY);
        break;
    }

    if (targetElement) {
      targetElement.focus();
    }
  }

  private findElementAbove(x: number, y: number): HTMLElement | null {
    return this.focusableElements.find(el => {
      const rect = el.getBoundingClientRect();
      return rect.top < y && rect.left <= x && rect.right >= x;
    }) || null;
  }

  private findElementBelow(x: number, y: number): HTMLElement | null {
    return this.focusableElements.find(el => {
      const rect = el.getBoundingClientRect();
      return rect.top > y && rect.left <= x && rect.right >= x;
    }) || null;
  }

  private findElementLeft(x: number, y: number): HTMLElement | null {
    return this.focusableElements.find(el => {
      const rect = el.getBoundingClientRect();
      return rect.left < x && rect.top <= y && rect.bottom >= y;
    }) || null;
  }

  private findElementRight(x: number, y: number): HTMLElement | null {
    return this.focusableElements.find(el => {
      const rect = el.getBoundingClientRect();
      return rect.left > x && rect.top <= y && rect.bottom >= y;
    }) || null;
  }

  private moveFocusToFirst(): void {
    if (this.focusableElements.length > 0) {
      this.state.currentFocusIndex = 0;
      this.focusableElements[0].focus();
    }
  }

  private moveFocusToLast(): void {
    if (this.focusableElements.length > 0) {
      this.state.currentFocusIndex = this.focusableElements.length - 1;
      this.focusableElements[this.focusableElements.length - 1].focus();
    }
  }

  private clearFocus(): void {
    this.state.focusedElement?.blur();
    this.state.focusedElement = null;
    this.state.isKeyboardFocused = false;
  }

  private updateFocusIndex(): void {
    const index = this.focusableElements.indexOf(this.state.focusedElement!);
    if (index !== -1) {
      this.state.currentFocusIndex = index;
    }
  }

  private updateHighContrastStyles(): void {
    if (this.state.isHighContrast) {
      document.body.classList.add('timeline-high-contrast');
    } else {
      document.body.classList.remove('timeline-high-contrast');
    }
  }

  private updateReducedMotionStyles(): void {
    if (this.state.isReducedMotion) {
      document.body.classList.add('timeline-reduced-motion');
    } else {
      document.body.classList.remove('timeline-reduced-motion');
    }
  }

  // Public methods
  public announce(message: string): void {
    if (!this.options.enableLiveRegions) return;

    const liveRegion = document.querySelector('.timeline-live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      this.state.currentAnnouncement = message;
    }
  }

  public setFocusableElements(elements: HTMLElement[]): void {
    this.focusableElements = elements;
    this.state.totalFocusableElements = elements.length;
  }

  public addFocusableElement(element: HTMLElement): void {
    if (!this.focusableElements.includes(element)) {
      this.focusableElements.push(element);
      this.state.totalFocusableElements = this.focusableElements.length;
    }
  }

  public removeFocusableElement(element: HTMLElement): void {
    const index = this.focusableElements.indexOf(element);
    if (index !== -1) {
      this.focusableElements.splice(index, 1);
      this.state.totalFocusableElements = this.focusableElements.length;
    }
  }

  public getState(): AccessibilityState {
    return { ...this.state };
  }

  public getOptions(): AccessibilityOptions {
    return { ...this.options };
  }

  public updateOptions(newOptions: Partial<AccessibilityOptions>): void {
    this.options = { ...this.options, ...newOptions };
  }

  public destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.focusableElements = [];
  }
}

// Global accessibility manager
let globalAccessibilityManager: AccessibilityManager | null = null;

export function getAccessibilityManager(): AccessibilityManager {
  if (!globalAccessibilityManager) {
    globalAccessibilityManager = new AccessibilityManager();
  }
  return globalAccessibilityManager;
}

// Utility functions
export function createARIALabel(text: string, level: '1' | '2' | '3' | '4' | '5' | '6' = '2'): string {
  return `Timeline ${text}`;
}

export function createARIALiveRegion(): HTMLElement {
  const region = document.createElement('div');
  region.setAttribute('aria-live', 'polite');
  region.setAttribute('aria-atomic', 'true');
  region.className = 'timeline-live-region';
  return region;
}

export function createSkipLink(text: string, targetId: string): HTMLElement {
  const link = document.createElement('a');
  link.href = `#${targetId}`;
  link.textContent = text;
  link.className = 'timeline-skip-link';
  link.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: #000;
    color: #fff;
    padding: 8px;
    text-decoration: none;
    z-index: 1000;
  `;
  return link;
}

export function createFocusTrap(container: HTMLElement): () => void {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  container.addEventListener('keydown', handleTabKey);
  firstElement?.focus();

  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
}
