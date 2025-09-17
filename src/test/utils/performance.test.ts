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
import { measurePerformance } from '../utils/test-utils';

describe('Performance Tests', () => {
  it('Materials page renders within performance budget', () => {
    const renderTime = measurePerformance(() => {
      render(<Materials />);
    });
    
    expect(renderTime).toBeLessThan(100); // 100ms budget
  });

  it('Tiles page renders within performance budget', () => {
    const renderTime = measurePerformance(() => {
      render(<Tiles />);
    });
    
    expect(renderTime).toBeLessThan(100); // 100ms budget
  });

  it('Pricing page renders within performance budget', () => {
    const renderTime = measurePerformance(() => {
      render(<Pricing />);
    });
    
    expect(renderTime).toBeLessThan(100); // 100ms budget
  });

  it('Logistics page renders within performance budget', () => {
    const renderTime = measurePerformance(() => {
      render(<Logistics />);
    });
    
    expect(renderTime).toBeLessThan(100); // 100ms budget
  });

  it('Accommodation page renders within performance budget', () => {
    const renderTime = measurePerformance(() => {
      render(<Accommodation />);
    });
    
    expect(renderTime).toBeLessThan(100); // 100ms budget
  });

  it('Files page renders within performance budget', () => {
    const renderTime = measurePerformance(() => {
      render(<Files />);
    });
    
    expect(renderTime).toBeLessThan(100); // 100ms budget
  });

  it('Concepts page renders within performance budget', () => {
    const renderTime = measurePerformance(() => {
      render(<Concepts />);
    });
    
    expect(renderTime).toBeLessThan(100); // 100ms budget
  });

  it('Documents page renders within performance budget', () => {
    const renderTime = measurePerformance(() => {
      render(<Documents />);
    });
    
    expect(renderTime).toBeLessThan(100); // 100ms budget
  });

  it('Messaging page renders within performance budget', () => {
    const renderTime = measurePerformance(() => {
      render(<Messaging />);
    });
    
    expect(renderTime).toBeLessThan(100); // 100ms budget
  });
});
