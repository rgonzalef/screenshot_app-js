const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')

const { formatDate } = require('./helpers/timestamp')

async function takeScreenshot(url, format) {
  let browser

  try {
    browser = await puppeteer.launch({
      headless: false,
    })

    const page = await browser.newPage()

    // Handle 'error' event to close browser if there is a loading problem
    page.on('error', async (err) => {
      console.error('Error loading the page:', err.message)
      if (browser) await browser.close()
    })

    page.on('requestfailed', async (request) => {
      // console.error(
      //   'Request failed:',
      //   request.url(),
      //   request.failure().errorText
      // )
    })

    const response = await page.goto(url, { waitUntil: 'networkidle2' })

    // Check response
    if (!response || !response.ok()) {
      throw new Error(
        `Failed to load URL: ${url}. Status: ${
          response ? response.status() : 'No response'
        }`
      )
    }

    // Set size electron window
    try {
      await page.setViewport({
        width: 1300,
        height: 1500,
        deviceScaleFactor: 1,
      })
    } catch (viewportError) {
      console.error('Failed to set viewport:', viewportError.message)
    }

    // Create output directory
    const outputDir = path.join(__dirname, 'screenshots')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Set filepath
    const timestamp = new Date()
    const formattedTimestamp = formatDate(timestamp)

    const filePath = path.join(
      outputDir,
      `screenshot_${formattedTimestamp}.${format}`
    )

    // take screenshot
    if (format === 'png') {
      await page.screenshot({ path: filePath })
    } else if (format === 'pdf') {
      await page.pdf({ path: filePath, format: 'A4' })
    }

    console.log(`Screenshot saved at ${filePath}`)
    return filePath
  } catch (error) {
    console.error('Error:', error.message)
    return null
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

module.exports = { takeScreenshot }
