import { test, expect, chromium, request } from '@playwright/test';
import fs from 'fs';

const username = process.env._USERNAME || '';
const password = process.env._PASSWORD || '';
const key = process.env._SECRET_KEY;
const token = process.env._TOKEN;
const url = 'https://api.trello.com';
const filePath = 'fixtures/data.txt';
const content = 'message';

// const browser = await chromium.launch();
// const context = await browser.newContext();
// await context.clearCookies();
test.describe('Trello', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    // Test case steps:
    // 1. Create new board
    // 2. Add ticket in To Do
    // 3. Upload file in ticket
    test('should create new board', async ({ page, request }) => {
        createFile(filePath, content);
        const listName: string = 'To Do';
        const ticketName: string = 'New ticket';

        console.log('Logging in...')
        await page.click('a[data-uuid$="login"]');
        await page.waitForSelector('#user');
        await page.type('#user', username, { delay: 100 });
        // await page.locator('#user').fill(username);
        await page.click('#login');
        await page.waitForSelector('#password');
        await page.type('#password', password, { delay: 100 });
        await page.waitForSelector('#login-submit');
        await page.click('#login-submit');
        console.log('Logging in done.');

        // const response = await request.get('https://api.trello.com/1/boards/{boardid}?key={}&token={}');
        // const respBody = JSON.parse(await response.text());
        // console.log(respBody);

        console.log('Creating new board...')
        const boardName: string = 'Playwright project board';
        await page.getByTestId('header-create-menu-button').click();
        await page.getByTestId('header-create-board-button').click();
        await page.getByTestId('create-board-title-input').type(boardName, { delay: 100 });
        // Wait for a response that contains '1/boards' in its url
        const responsePromise = page.waitForResponse(resp => resp.url().includes('1/boards'));
        // Click the button that triggers the request
        await page.getByTestId('create-board-submit-button').click();
        // Get the response object
        const response = await responsePromise;
        // Log the response url, status and body
        console.log(response.url(), response.status());
        const jsonData = await response.json();
        const boardId = jsonData.id;
        // const respBody = JSON.parse(await response.text());
        // console.log(respBody);
        console.log(response.status(), 'Board created');

        console.log('Creating new ticket...');
        await page.fill('.list-name-input', listName);
        await page.click('input[type="submit"]');
        await page.click('.js-add-a-card');
        await page.fill('.list-card-composer-textarea', ticketName);
        await page.click('.cc-controls-section input[type="submit"]');
        console.log('Ticket created');

        console.log('Uploading file...');
        await page.getByText(ticketName).click();
        // await page.getByText('new ticket').click({ button: 'right' });
        // await page.waitForSelector('quick-card-editor-open-card');
        // await page.getByTestId('quick-card-editor-open-card').click({);
        await page.click('.window-sidebar a.js-attach');
        await page.locator('input.js-attach-file').setInputFiles(filePath);
        console.log('File uploaded');

        console.log('Deleting new board...');
        const deleteResponse = page.waitForResponse(resp => resp.url().includes(`1/boards/${boardId}`));
        await request.delete(`${url}/1/boards/${boardId}?key=${key}&token=${token}`);
        const deleteBoardResponse = await deleteResponse;
        // const respBodyDel = JSON.parse(await respDel.text());
        console.log(deleteBoardResponse.status(), 'Board deleted');
    });
});

async function createFile(filePath, content) {
    try {
        await fs.promises.writeFile(filePath, content);
        console.log(`File "${filePath}" created successfully.`);
    } catch (error) {
        console.error(`Error creating file "${filePath}":`, error);
    }
}