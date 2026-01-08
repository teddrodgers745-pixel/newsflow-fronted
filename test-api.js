const { chromium } = require('playwright');
const path = require('path');

async function testNewsApp() {
    console.log('Testing NewsFlow with real API key...');
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 390, height: 844 }
    });
    const page = await context.newPage();

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
        const appPath = path.resolve(__dirname, 'index.html');
        await page.goto(`file://${appPath}`, { waitUntil: 'networkidle' });
        console.log('✓ Page loaded');

        await page.waitForTimeout(3000);

        // Проверяем, загрузились ли новости
        const newsCards = await page.$$('.news-card');
        console.log('✓ News cards rendered:', newsCards.length);

        // Ищем признаки работы API
        const consoleOutput = consoleMessages.map(m => m.text).join('\n');
        
        if (consoleOutput.includes('Загрузка новостей из API')) {
            console.log('✓ API request initiated');
        }
        
        if (consoleOutput.includes('Ответ API')) {
            console.log('✓ API response received');
        }
        
        if (consoleOutput.includes('status') && consoleOutput.includes('success')) {
            console.log('✓ API returned success status');
        }

        // Проверяем наличие демо-режима
        if (consoleOutput.includes('демо-режим')) {
            console.log('⚠️ Running in demo mode (API key may be invalid)');
        } else {
            console.log('✓ Using real API data!');
        }

        console.log('\n--- Console Output ---');
        consoleMessages.forEach(msg => {
            if (msg.type === 'log' || msg.type === 'warning') {
                console.log(`[${msg.type}] ${msg.text}`);
            }
        });

        if (consoleErrors.length > 0) {
            console.log('\n--- ERRORS ---');
            consoleErrors.forEach(err => console.log('ERROR:', err));
        } else {
            console.log('\n✅ No errors!');
        }

    } catch (error) {
        console.error('Test failed:', error.message);
    } finally {
        await browser.close();
    }
}

testNewsApp();
