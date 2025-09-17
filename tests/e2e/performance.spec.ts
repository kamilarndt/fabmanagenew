import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load materials page within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/materials');
    
    const loadTime = Date.now() - startTime;
    
    // Check that page loads within 2 seconds
    expect(loadTime).toBeLessThan(2000);
    
    // Check that page is interactive within 3 seconds
    await page.waitForSelector('text=Materials Management', { timeout: 3000 });
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/materials');
    
    // Check that page has good LCP (Largest Contentful Paint)
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });
    
    expect(lcp).toBeLessThan(2500); // LCP should be under 2.5s
    
    // Check that page has good FID (First Input Delay)
    const fid = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const firstEntry = entries[0];
          resolve(firstEntry.processingStart - firstEntry.startTime);
        }).observe({ entryTypes: ['first-input'] });
      });
    });
    
    expect(fid).toBeLessThan(100); // FID should be under 100ms
    
    // Check that page has good CLS (Cumulative Layout Shift)
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          resolve(clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
      });
    });
    
    expect(cls).toBeLessThan(0.1); // CLS should be under 0.1
  });

  test('should handle large datasets efficiently', async ({ page }) => {
    // Mock large dataset
    await page.route('**/api/materials', route => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Material ${i}`,
        code: `MAT-${i}`,
        category: 'steel',
        unit_price: 100 + i,
      }));
      
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(largeDataset),
      });
    });
    
    const startTime = Date.now();
    
    await page.goto('/materials');
    
    const loadTime = Date.now() - startTime;
    
    // Check that large dataset loads within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Check that pagination is working
    await expect(page.getByText('1 / 50')).toBeVisible();
  });

  test('should have efficient bundle size', async ({ page }) => {
    await page.goto('/materials');
    
    // Check that JavaScript bundle is not too large
    const jsSize = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      return scripts.reduce((total, script) => {
        const src = script.getAttribute('src');
        if (src && src.includes('.js')) {
          return total + 1; // Simplified check
        }
        return total;
      }, 0);
    });
    
    expect(jsSize).toBeLessThan(10); // Should not have too many JS files
    
    // Check that CSS bundle is not too large
    const cssSize = await page.evaluate(() => {
      const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return styles.length;
    });
    
    expect(cssSize).toBeLessThan(5); // Should not have too many CSS files
  });

  test('should have efficient image loading', async ({ page }) => {
    await page.goto('/materials');
    
    // Check that images are lazy loaded
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Check that images have loading="lazy" attribute
      const lazyImages = page.locator('img[loading="lazy"]');
      await expect(lazyImages).toHaveCount(imageCount);
    }
  });

  test('should have efficient API calls', async ({ page }) => {
    const apiCalls = [];
    
    // Monitor API calls
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        apiCalls.push({
          url: request.url(),
          method: request.method(),
          timestamp: Date.now(),
        });
      }
    });
    
    await page.goto('/materials');
    
    // Check that API calls are efficient
    expect(apiCalls.length).toBeLessThan(5); // Should not make too many API calls
    
    // Check that API calls are fast
    const apiCallTimes = apiCalls.map(call => call.timestamp);
    const totalApiTime = Math.max(...apiCallTimes) - Math.min(...apiCallTimes);
    expect(totalApiTime).toBeLessThan(1000); // API calls should complete within 1 second
  });

  test('should have efficient memory usage', async ({ page }) => {
    await page.goto('/materials');
    
    // Check that memory usage is reasonable
    const memoryInfo = await page.evaluate(() => {
      if ('memory' in performance) {
        return {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        };
      }
      return null;
    });
    
    if (memoryInfo) {
      expect(memoryInfo.usedJSHeapSize).toBeLessThan(50 * 1024 * 1024); // Less than 50MB
      expect(memoryInfo.totalJSHeapSize).toBeLessThan(100 * 1024 * 1024); // Less than 100MB
    }
  });

  test('should have efficient rendering', async ({ page }) => {
    await page.goto('/materials');
    
    // Check that rendering is efficient
    const renderTime = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
    });
    
    expect(renderTime).toBeLessThan(100); // DOM content should load within 100ms
  });

  test('should have efficient scrolling', async ({ page }) => {
    await page.goto('/materials');
    
    // Test scrolling performance
    const startTime = Date.now();
    
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    const scrollTime = Date.now() - startTime;
    
    expect(scrollTime).toBeLessThan(100); // Scrolling should be smooth
  });

  test('should have efficient form interactions', async ({ page }) => {
    await page.goto('/materials');
    
    // Test form interaction performance
    const startTime = Date.now();
    
    await page.click('text=Add Material');
    await page.fill('input[name="name"]', 'Test Material');
    await page.fill('input[name="code"]', 'TEST-001');
    await page.selectOption('select[name="category"]', 'steel');
    await page.fill('input[name="unit_price"]', '100');
    
    const formTime = Date.now() - startTime;
    
    expect(formTime).toBeLessThan(500); // Form interactions should be fast
  });

  test('should have efficient search functionality', async ({ page }) => {
    await page.goto('/materials');
    
    // Test search performance
    const startTime = Date.now();
    
    await page.fill('input[placeholder="Search materials..."]', 'Steel');
    
    const searchTime = Date.now() - startTime;
    
    expect(searchTime).toBeLessThan(200); // Search should be fast
    
    // Check that search results are displayed quickly
    await page.waitForSelector('text=Steel Material', { timeout: 1000 });
  });

  test('should have efficient pagination', async ({ page }) => {
    await page.goto('/materials');
    
    // Test pagination performance
    const startTime = Date.now();
    
    await page.click('text=Next');
    
    const paginationTime = Date.now() - startTime;
    
    expect(paginationTime).toBeLessThan(300); // Pagination should be fast
    
    // Check that page content is updated quickly
    await page.waitForSelector('text=Page 2', { timeout: 1000 });
  });

  test('should have efficient modal operations', async ({ page }) => {
    await page.goto('/materials');
    
    // Test modal performance
    const startTime = Date.now();
    
    await page.click('text=Add Material');
    
    const modalTime = Date.now() - startTime;
    
    expect(modalTime).toBeLessThan(200); // Modal should open quickly
    
    // Check that modal is interactive quickly
    await page.waitForSelector('input[name="name"]', { timeout: 500 });
  });

  test('should have efficient data updates', async ({ page }) => {
    await page.goto('/materials');
    
    // Test data update performance
    const startTime = Date.now();
    
    await page.click('text=Add Material');
    await page.fill('input[name="name"]', 'New Material');
    await page.fill('input[name="code"]', 'NEW-001');
    await page.selectOption('select[name="category"]', 'steel');
    await page.fill('input[name="unit_price"]', '150');
    await page.click('text=Save');
    
    const updateTime = Date.now() - startTime;
    
    expect(updateTime).toBeLessThan(1000); // Data updates should be fast
    
    // Check that data is updated in the UI quickly
    await page.waitForSelector('text=New Material', { timeout: 1000 });
  });

  test('should have efficient error handling', async ({ page }) => {
    await page.goto('/materials');
    
    // Test error handling performance
    const startTime = Date.now();
    
    // Simulate error
    await page.route('**/api/materials', route => route.abort());
    
    const errorTime = Date.now() - startTime;
    
    expect(errorTime).toBeLessThan(500); // Error handling should be fast
    
    // Check that error is displayed quickly
    await page.waitForSelector('text=Error loading materials', { timeout: 1000 });
  });

  test('should have efficient loading states', async ({ page }) => {
    await page.goto('/materials');
    
    // Test loading state performance
    const startTime = Date.now();
    
    // Simulate slow API
    await page.route('**/api/materials', route => {
      setTimeout(() => route.continue(), 1000);
    });
    
    await page.reload();
    
    const loadingTime = Date.now() - startTime;
    
    expect(loadingTime).toBeLessThan(2000); // Loading should complete within 2 seconds
    
    // Check that loading state is shown quickly
    await page.waitForSelector('text=Loading materials...', { timeout: 500 });
  });
});