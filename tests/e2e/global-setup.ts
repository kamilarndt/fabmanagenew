import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use
  
  console.log('🚀 Starting global setup...')
  
  // Launch browser for setup
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  try {
    // Navigate to the application
    await page.goto(baseURL || 'http://localhost:3000')
    
    // Wait for the application to load
    await page.waitForLoadState('networkidle')
    
    // Check if the application is running
    const title = await page.title()
    console.log(`📱 Application title: ${title}`)
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/global-setup.png' })
    
    console.log('✅ Global setup completed successfully')
  } catch (error) {
    console.error('❌ Global setup failed:', error)
    throw error
  } finally {
    await browser.close()
  }
}

export default globalSetup
