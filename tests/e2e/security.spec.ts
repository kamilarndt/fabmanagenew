import { test, expect } from '@playwright/test';

test.describe('Security Tests', () => {
  test('should prevent XSS attacks', async ({ page }) => {
    await page.goto('/materials');
    
    // Try to inject malicious script
    await page.click('text=Add Material');
    await page.fill('input[name="name"]', '<script>alert("XSS")</script>');
    await page.fill('input[name="code"]', 'XSS-001');
    await page.selectOption('select[name="category"]', 'steel');
    await page.fill('input[name="unit_price"]', '100');
    await page.click('text=Save');
    
    // Check that script is not executed
    const alertDialog = page.locator('text=alert("XSS")');
    await expect(alertDialog).not.toBeVisible();
    
    // Check that malicious content is escaped
    const materialName = page.locator('text=<script>alert("XSS")</script>');
    await expect(materialName).not.toBeVisible();
  });

  test('should prevent SQL injection', async ({ page }) => {
    await page.goto('/materials');
    
    // Try to inject SQL
    await page.fill('input[placeholder="Search materials..."]', "'; DROP TABLE materials; --");
    
    // Check that search still works
    await expect(page.getByText('Materials Management')).toBeVisible();
    
    // Check that no error is thrown
    const errorMessage = page.locator('text=Error loading materials');
    await expect(errorMessage).not.toBeVisible();
  });

  test('should prevent CSRF attacks', async ({ page }) => {
    await page.goto('/materials');
    
    // Check that forms have CSRF tokens
    const csrfToken = page.locator('input[name="_token"]');
    await expect(csrfToken).toBeVisible();
    
    // Check that API calls include CSRF token
    const apiCalls = [];
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        apiCalls.push({
          url: request.url(),
          headers: request.headers(),
        });
      }
    });
    
    await page.click('text=Add Material');
    await page.fill('input[name="name"]', 'Test Material');
    await page.fill('input[name="code"]', 'TEST-001');
    await page.selectOption('select[name="category"]', 'steel');
    await page.fill('input[name="unit_price"]', '100');
    await page.click('text=Save');
    
    // Check that CSRF token is included in API calls
    expect(apiCalls.length).toBeGreaterThan(0);
    const lastCall = apiCalls[apiCalls.length - 1];
    expect(lastCall.headers['x-csrf-token']).toBeTruthy();
  });

  test('should prevent clickjacking', async ({ page }) => {
    await page.goto('/materials');
    
    // Check that page has X-Frame-Options header
    const response = await page.goto('/materials');
    const headers = response?.headers();
    
    expect(headers?.['x-frame-options']).toBe('DENY');
    
    // Check that page has Content-Security-Policy header
    expect(headers?.['content-security-policy']).toContain("frame-ancestors 'none'");
  });

  test('should prevent information disclosure', async ({ page }) => {
    await page.goto('/materials');
    
    // Check that sensitive information is not exposed in HTML
    const pageContent = await page.content();
    
    // Check that API keys are not exposed
    expect(pageContent).not.toMatch(/api[_-]?key/i);
    expect(pageContent).not.toMatch(/secret[_-]?key/i);
    expect(pageContent).not.toMatch(/private[_-]?key/i);
    
    // Check that database credentials are not exposed
    expect(pageContent).not.toMatch(/database[_-]?password/i);
    expect(pageContent).not.toMatch(/db[_-]?password/i);
    
    // Check that internal URLs are not exposed
    expect(pageContent).not.toMatch(/localhost:3000/i);
    expect(pageContent).not.toMatch(/127\.0\.0\.1/i);
  });

  test('should prevent directory traversal', async ({ page }) => {
    // Try to access sensitive files
    const sensitivePaths = [
      '/etc/passwd',
      '/etc/hosts',
      '/etc/shadow',
      '/windows/system32/config/sam',
      '/proc/version',
      '/proc/cpuinfo',
    ];
    
    for (const path of sensitivePaths) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(404);
    }
  });

  test('should prevent file upload attacks', async ({ page }) => {
    await page.goto('/files');
    
    // Try to upload malicious file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'malicious.php',
      mimeType: 'application/x-php',
      buffer: Buffer.from('<?php system($_GET["cmd"]); ?>'),
    });
    
    // Check that malicious file is rejected
    const errorMessage = page.locator('text=Invalid file type');
    await expect(errorMessage).toBeVisible();
    
    // Check that file is not uploaded
    const uploadedFile = page.locator('text=malicious.php');
    await expect(uploadedFile).not.toBeVisible();
  });

  test('should prevent authentication bypass', async ({ page }) => {
    // Try to access protected route without authentication
    await page.goto('/materials');
    
    // Check that user is redirected to login
    await expect(page).toHaveURL(/login/);
    
    // Check that login form is displayed
    await expect(page.getByText('Login')).toBeVisible();
  });

  test('should prevent session hijacking', async ({ page }) => {
    await page.goto('/materials');
    
    // Check that session cookies are secure
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(cookie => cookie.name === 'session');
    
    if (sessionCookie) {
      expect(sessionCookie.secure).toBe(true);
      expect(sessionCookie.httpOnly).toBe(true);
      expect(sessionCookie.sameSite).toBe('Strict');
    }
  });

  test('should prevent brute force attacks', async ({ page }) => {
    await page.goto('/login');
    
    // Try multiple failed login attempts
    for (let i = 0; i < 5; i++) {
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'wrongpassword');
      await page.click('text=Login');
      
      // Check that error message is shown
      await expect(page.getByText('Invalid credentials')).toBeVisible();
    }
    
    // Check that account is locked after multiple attempts
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'correctpassword');
    await page.click('text=Login');
    
    // Check that account is locked
    await expect(page.getByText('Account locked due to multiple failed attempts')).toBeVisible();
  });

  test('should prevent privilege escalation', async ({ page }) => {
    // Login as regular user
    await page.goto('/login');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('text=Login');
    
    // Try to access admin route
    await page.goto('/admin');
    
    // Check that access is denied
    await expect(page.getByText('Access denied')).toBeVisible();
    
    // Check that user is redirected to appropriate page
    await expect(page).toHaveURL(/materials/);
  });

  test('should prevent data tampering', async ({ page }) => {
    await page.goto('/materials');
    
    // Try to modify data in browser
    await page.evaluate(() => {
      // Try to modify material data
      const materials = document.querySelectorAll('tr[data-material-id]');
      if (materials.length > 0) {
        const firstMaterial = materials[0];
        const nameCell = firstMaterial.querySelector('td:first-child');
        if (nameCell) {
          nameCell.textContent = 'Hacked Material';
        }
      }
    });
    
    // Check that data is not actually modified
    const materialName = page.locator('text=Hacked Material');
    await expect(materialName).not.toBeVisible();
    
    // Check that original data is still there
    const originalMaterial = page.locator('text=Steel Material');
    await expect(originalMaterial).toBeVisible();
  });

  test('should prevent timing attacks', async ({ page }) => {
    await page.goto('/login');
    
    // Measure response time for valid user
    const startTime = Date.now();
    await page.fill('input[name="email"]', 'valid@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('text=Login');
    await page.waitForSelector('text=Materials Management');
    const validUserTime = Date.now() - startTime;
    
    // Measure response time for invalid user
    const startTime2 = Date.now();
    await page.goto('/login');
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('text=Login');
    await page.waitForSelector('text=Invalid credentials');
    const invalidUserTime = Date.now() - startTime2;
    
    // Check that response times are similar (within 100ms)
    const timeDifference = Math.abs(validUserTime - invalidUserTime);
    expect(timeDifference).toBeLessThan(100);
  });

  test('should prevent injection attacks in search', async ({ page }) => {
    await page.goto('/materials');
    
    // Try various injection attacks in search
    const maliciousInputs = [
      '<script>alert("XSS")</script>',
      "'; DROP TABLE materials; --",
      '${7*7}',
      '{{7*7}}',
      '{{config}}',
      '{{request}}',
    ];
    
    for (const input of maliciousInputs) {
      await page.fill('input[placeholder="Search materials..."]', input);
      
      // Check that search still works
      await expect(page.getByText('Materials Management')).toBeVisible();
      
      // Check that no error is thrown
      const errorMessage = page.locator('text=Error loading materials');
      await expect(errorMessage).not.toBeVisible();
      
      // Clear search
      await page.fill('input[placeholder="Search materials..."]', '');
    }
  });

  test('should prevent open redirect attacks', async ({ page }) => {
    await page.goto('/materials');
    
    // Try to redirect to external site
    const redirectUrl = 'https://malicious-site.com';
    await page.goto(`/redirect?url=${encodeURIComponent(redirectUrl)}`);
    
    // Check that redirect is not allowed
    await expect(page).not.toHaveURL(/malicious-site\.com/);
    
    // Check that user stays on the site
    await expect(page).toHaveURL(/materials/);
  });

  test('should prevent information leakage in error messages', async ({ page }) => {
    await page.goto('/materials');
    
    // Trigger an error
    await page.route('**/api/materials', route => route.abort());
    
    // Check that error message doesn't leak sensitive information
    const errorMessage = page.locator('text=Error loading materials');
    await expect(errorMessage).toBeVisible();
    
    // Check that error message doesn't contain stack traces
    const pageContent = await page.content();
    expect(pageContent).not.toMatch(/at\s+.*\(.*\)/);
    expect(pageContent).not.toMatch(/stack\s+trace/i);
    expect(pageContent).not.toMatch(/exception/i);
  });

  test('should prevent cache poisoning', async ({ page }) => {
    await page.goto('/materials');
    
    // Check that cache headers are properly set
    const response = await page.goto('/materials');
    const headers = response?.headers();
    
    // Check that cache control is set
    expect(headers?.['cache-control']).toBeTruthy();
    
    // Check that ETag is set
    expect(headers?.['etag']).toBeTruthy();
    
    // Check that Vary header is set
    expect(headers?.['vary']).toBeTruthy();
  });

  test('should prevent HTTP parameter pollution', async ({ page }) => {
    await page.goto('/materials');
    
    // Try to pollute parameters
    await page.goto('/materials?category=steel&category=wood&category=plastic');
    
    // Check that only one category is processed
    const categoryFilter = page.locator('select[name="category"]');
    await expect(categoryFilter).toHaveValue('steel');
    
    // Check that page still works
    await expect(page.getByText('Materials Management')).toBeVisible();
  });

  test('should prevent HTTP header injection', async ({ page }) => {
    await page.goto('/materials');
    
    // Try to inject headers
    await page.route('**/api/materials', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: {
          'X-Injected-Header': 'malicious-value',
          'X-Forwarded-For': '127.0.0.1',
        },
        body: JSON.stringify([]),
      });
    });
    
    // Check that injected headers are not processed
    const pageContent = await page.content();
    expect(pageContent).not.toMatch(/X-Injected-Header/);
    expect(pageContent).not.toMatch(/malicious-value/);
  });

  test('should prevent XML external entity attacks', async ({ page }) => {
    await page.goto('/materials');
    
    // Try to upload XML with external entity
    const maliciousXml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<foo>&xxe;</foo>`;
    
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'malicious.xml',
      mimeType: 'application/xml',
      buffer: Buffer.from(maliciousXml),
    });
    
    // Check that XML is rejected
    const errorMessage = page.locator('text=Invalid file type');
    await expect(errorMessage).toBeVisible();
  });

  test('should prevent server-side request forgery', async ({ page }) => {
    await page.goto('/materials');
    
    // Try to make SSRF request
    await page.fill('input[placeholder="Search materials..."]', 'http://localhost:22');
    
    // Check that request is not made
    const apiCalls = [];
    page.on('request', request => {
      if (request.url().includes('localhost:22')) {
        apiCalls.push(request.url());
      }
    });
    
    // Wait a bit to see if request is made
    await page.waitForTimeout(1000);
    
    // Check that no SSRF request was made
    expect(apiCalls.length).toBe(0);
  });
});