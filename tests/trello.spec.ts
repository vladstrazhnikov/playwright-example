import { test, expect, request } from '@playwright/test';
import { LoginPage } from '../pages/Login.page';
import { MainPage } from '../pages/Main.page';
import { deleteBoardRequest, createBoardRequest, getLists, createCardRequest } from '../api/api.spec';
import fs from 'fs';

const username = process.env._USERNAME || '';
const password = process.env._PASSWORD || '';
const key = process.env._SECRET_KEY || '';
const token = process.env._TOKEN || '';
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
        const loginPage = new LoginPage(page);

        await createFile(filePath, content);

        const listName: string = 'To Do';
        const ticketName: string = 'New ticket';
        const boardName: string = 'Playwright project board';

        console.log('Logging in...');
        await loginPage.login(username, password);
        const loggedInElement = await page.waitForSelector('[data-testid="header-member-menu-button"]', { state: 'visible' });
        expect(loggedInElement).toBeTruthy();
        // expect(page).toHaveTitle(/Boards [|] Trello/);
        console.log('Logging in done.');

        // const response = await request.get('https://api.trello.com/1/boards/{boardid}?key={}&token={}');
        // const respBody = JSON.parse(await response.text());
        // console.log(respBody);

        console.log('Creating new board...');
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
        await page.click('.window-sidebar .js-react-root button [data-testid="AttachmentIcon"]');
        await page.locator('#card-attachment-file-picker').setInputFiles(filePath);
        console.log('File uploaded');

        console.log('Deleting new board...');
        const deleteBoardResponse = await deleteBoardRequest(request, url, boardId, key, token);
        console.log('Board deleted', deleteBoardResponse.response.status(), deleteBoardResponse.json);
    });
});

test('should drag n drop ticket', async ({ browser, request }) => {
    const boardName: string = 'Dragndrop board';
    const cardName: string = 'Draggable card'; 

    console.log('Creating board');
    const createResponse = await createBoardRequest(request, url, key, token, boardName);
    const boardId = createResponse.json.id;
    console.log('Getting lists...');
    const getListsResponse = await getLists(request, url, boardId, key, token);
    const firstList = getListsResponse.json[0].id;
    await createCardRequest(request, url, key, token, cardName, firstList);
    // to generate *.json file use npx codegen --save-storage=trello.json
    const context = await browser.newContext({
        storageState: './trello.json'
    });
    const page = await context.newPage();
    const mainPage = new MainPage(page);
    await page.waitForTimeout(3000);
    await page.goto('https://trello.com');
    await page.getByText(boardName).click();
    // await page.locator(mainPage.firstCard).hover();
    // await page.mouse.down();
    // await page.locator(mainPage.secondList).hover();
    // await page.mouse.up();
    await page.dragAndDrop(mainPage.firstCard, mainPage.secondList);
    await deleteBoardRequest(request, url, boardId, key, token);
});

async function createFile(filePath, content) {
    try {
        await fs.promises.writeFile(filePath, content);
        console.log(`File "${filePath}" created successfully.`);
    } catch (error) {
        console.error(`Error creating file "${filePath}":`, error);
    }
}