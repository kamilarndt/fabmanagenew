import { describe, it, expect } from 'vitest';
import { render } from '../utils/test-utils';
import Materials from '../../pages/Materials';
import Tiles from '../../pages/Tiles';
import Pricing from '../../pages/Pricing';
import Logistics from '../../pages/Logistics';
import Accommodation from '../../pages/Accommodation';
import Files from '../../pages/Files';
import Concepts from '../../pages/Concepts';
import Documents from '../../pages/Documents';
import Messaging from '../../pages/Messaging';

describe('Security Tests', () => {
  it('Materials page has no XSS vulnerabilities', () => {
    const { container } = render(<Materials />);
    
    // Check for script tags
    const scripts = container.querySelectorAll('script');
    expect(scripts.length).toBe(0);
    
    // Check for inline event handlers
    const elementsWithOnClick = container.querySelectorAll('[onclick]');
    expect(elementsWithOnClick.length).toBe(0);
    
    const elementsWithOnLoad = container.querySelectorAll('[onload]');
    expect(elementsWithOnLoad.length).toBe(0);
  });

  it('Tiles page has no XSS vulnerabilities', () => {
    const { container } = render(<Tiles />);
    
    // Check for script tags
    const scripts = container.querySelectorAll('script');
    expect(scripts.length).toBe(0);
    
    // Check for inline event handlers
    const elementsWithOnClick = container.querySelectorAll('[onclick]');
    expect(elementsWithOnClick.length).toBe(0);
    
    const elementsWithOnLoad = container.querySelectorAll('[onload]');
    expect(elementsWithOnLoad.length).toBe(0);
  });

  it('Pricing page has no XSS vulnerabilities', () => {
    const { container } = render(<Pricing />);
    
    // Check for script tags
    const scripts = container.querySelectorAll('script');
    expect(scripts.length).toBe(0);
    
    // Check for inline event handlers
    const elementsWithOnClick = container.querySelectorAll('[onclick]');
    expect(elementsWithOnClick.length).toBe(0);
    
    const elementsWithOnLoad = container.querySelectorAll('[onload]');
    expect(elementsWithOnLoad.length).toBe(0);
  });

  it('Logistics page has no XSS vulnerabilities', () => {
    const { container } = render(<Logistics />);
    
    // Check for script tags
    const scripts = container.querySelectorAll('script');
    expect(scripts.length).toBe(0);
    
    // Check for inline event handlers
    const elementsWithOnClick = container.querySelectorAll('[onclick]');
    expect(elementsWithOnClick.length).toBe(0);
    
    const elementsWithOnLoad = container.querySelectorAll('[onload]');
    expect(elementsWithOnLoad.length).toBe(0);
  });

  it('Accommodation page has no XSS vulnerabilities', () => {
    const { container } = render(<Accommodation />);
    
    // Check for script tags
    const scripts = container.querySelectorAll('script');
    expect(scripts.length).toBe(0);
    
    // Check for inline event handlers
    const elementsWithOnClick = container.querySelectorAll('[onclick]');
    expect(elementsWithOnClick.length).toBe(0);
    
    const elementsWithOnLoad = container.querySelectorAll('[onload]');
    expect(elementsWithOnLoad.length).toBe(0);
  });

  it('Files page has no XSS vulnerabilities', () => {
    const { container } = render(<Files />);
    
    // Check for script tags
    const scripts = container.querySelectorAll('script');
    expect(scripts.length).toBe(0);
    
    // Check for inline event handlers
    const elementsWithOnClick = container.querySelectorAll('[onclick]');
    expect(elementsWithOnClick.length).toBe(0);
    
    const elementsWithOnLoad = container.querySelectorAll('[onload]');
    expect(elementsWithOnLoad.length).toBe(0);
  });

  it('Concepts page has no XSS vulnerabilities', () => {
    const { container } = render(<Concepts />);
    
    // Check for script tags
    const scripts = container.querySelectorAll('script');
    expect(scripts.length).toBe(0);
    
    // Check for inline event handlers
    const elementsWithOnClick = container.querySelectorAll('[onclick]');
    expect(elementsWithOnClick.length).toBe(0);
    
    const elementsWithOnLoad = container.querySelectorAll('[onload]');
    expect(elementsWithOnLoad.length).toBe(0);
  });

  it('Documents page has no XSS vulnerabilities', () => {
    const { container } = render(<Documents />);
    
    // Check for script tags
    const scripts = container.querySelectorAll('script');
    expect(scripts.length).toBe(0);
    
    // Check for inline event handlers
    const elementsWithOnClick = container.querySelectorAll('[onclick]');
    expect(elementsWithOnClick.length).toBe(0);
    
    const elementsWithOnLoad = container.querySelectorAll('[onload]');
    expect(elementsWithOnLoad.length).toBe(0);
  });

  it('Messaging page has no XSS vulnerabilities', () => {
    const { container } = render(<Messaging />);
    
    // Check for script tags
    const scripts = container.querySelectorAll('script');
    expect(scripts.length).toBe(0);
    
    // Check for inline event handlers
    const elementsWithOnClick = container.querySelectorAll('[onclick]');
    expect(elementsWithOnClick.length).toBe(0);
    
    const elementsWithOnLoad = container.querySelectorAll('[onload]');
    expect(elementsWithOnLoad.length).toBe(0);
  });
});
