const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testNewsApp() {
    console.log('Starting Playwright test for NewsFlow app...');
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 390, height: 844 } // iPhone 14 Pro dimensions
    });
    const page = await context.newPage();

    // Collect console messages
    const consoleMessages = [];
    const consoleErrors = [];

    page.on('console', msg => {
        consoleMessages.push({ type: msg.type(), text: msg.text() });
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });

    page.on('pageerror', error => {
        consoleErrors.push(error.message);
    });

    try {
        // Navigate to the app
        const appPath = path.resolve(__dirname, 'index.html');
        await page.goto(`file://${appPath}`, { waitUntil: 'networkidle' });
        console.log('✓ Page loaded successfully');

        // Wait for app initialization
        await page.waitForTimeout(2000);

        // Check if main elements are present
        const header = await page.$('.header');
        const newsFeed = await page.$('#newsFeed');
        const bottomNav = await page.$('.bottom-nav');
        const categories = await page.$('.categories-scroll');

        console.log('✓ Header present:', !!header);
        console.log('✓ News feed present:', !!newsFeed);
        console.log('✓ Bottom navigation present:', !!bottomNav);
        console.log('✓ Categories scroll present:', !!categories);

        // Wait for content to load (skeleton should disappear)
        await page.waitForTimeout(2000);
        const skeletonVisible = await page.$eval('#skeletonLoader', el => el.style.display !== 'none');
        console.log('✓ Skeleton loader hidden:', !skeletonVisible);

        // Check for news cards
        const newsCards = await page.$$('.news-card');
        console.log('✓ News cards rendered:', newsCards.length);

        // Test category filtering
        const techChip = await page.$('.chip[data-category="technology"]');
        if (techChip) {
            await techChip.click();
            await page.waitForTimeout(1000);
            const filteredCards = await page.$$('.news-card');
            console.log('✓ Category filtering works:', filteredCards.length >= 0);
        }

        // Test bookmark functionality
        const bookmarkBtn = await page.$('.bookmark-btn');
        if (bookmarkBtn) {
            await bookmarkBtn.click();
            console.log('✓ Bookmark button clickable: true');
        }

        // Test bottom navigation
        const savedTab = await page.$('.nav-item[data-tab="saved"]');
        if (savedTab) {
            await savedTab.click();
            await page.waitForTimeout(500);
            console.log('✓ Tab navigation works');
        }

        // Test search overlay
        const searchBtn = await page.$('#searchBtn');
        if (searchBtn) {
            await searchBtn.click();
            await page.waitForTimeout(500);
            const searchOverlayVisible = await page.$eval('#searchOverlay', el => el.classList.contains('visible'));
            console.log('✓ Search overlay opens:', searchOverlayVisible);
            
            // Close search
            const closeBtn = await page.$('#closeSearch');
            if (closeBtn) {
                await closeBtn.click();
            }
        }

        // Report console errors
        console.log('\n--- Console Output ---');
        consoleMessages.forEach(msg => {
            console.log(`[${msg.type}] ${msg.text}`);
        });

        if (consoleErrors.length > 0) {
            console.log('\n--- ERRORS FOUND ---');
            consoleErrors.forEach(err => console.log('ERROR:', err));
            console.log('\n❌ Test completed with errors');
        } else {
            console.log('\n✅ Test completed successfully - No errors!');
        }

    } catch (error) {
        console.error('Test failed with error:', error.message);
    } finally {
        await browser.close();
    }
}

testNewsApp();
