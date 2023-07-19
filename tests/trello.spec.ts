import { test, expect } from '@playwright/test';
import { FileGeneratorUtil } from '../utils/fileGenerator';
import { LoginPage } from '../pages/Login.page';
import { MainPage } from '../pages/Main.page';
import { CardPage } from '../pages/Card.page';
import { deleteBoardRequest, createBoardRequest, getLists, createCardRequest } from '../api/api.spec';

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
    // 1. Login to the app
    // 2. Create new board
    // 3. Add card in To Do list
    // 4. Upload file in card
    test('should create new board', async ({ page, request }) => {
        const loginPage = new LoginPage(page);
        const mainPage = new MainPage(page);
        const cardPage = new CardPage(page);

        await FileGeneratorUtil.createFile(filePath, content);

        const listName: string = 'To Do';
        const cardName: string = 'New card';
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

        console.log('Creating new card...');
        await mainPage.fillListNameInput(listName);
        await mainPage.submitListButton();
        await mainPage.clickAddCardButton();
        await mainPage.fillCardNameInput(cardName);
        await mainPage.submitCardButton();
        console.log('Card created');

        console.log('Uploading file...');
        await page.getByText(cardName).click();
        // await page.getByText('new card').click({ button: 'right' });
        // await page.waitForSelector('quick-card-editor-open-card');
        // await page.getByTestId('quick-card-editor-open-card').click({);
        await page.click(cardPage.attachmentButton);
        await page.locator(cardPage.cardFileInput).setInputFiles(filePath);
        console.log('File uploaded');

        console.log('Deleting new board...');
        const deleteBoardResponse = await deleteBoardRequest(request, url, boardId, key, token);
        console.log('Board deleted', deleteBoardResponse.response.status(), deleteBoardResponse.json);
    });
});

// Test case steps:
// 1. Create board
// 2. Get lists id
// 3. Create card
// 4. Open created board
// 5. Drag card from first list to the second
test('should drag n drop card', async ({ browser, request }) => {
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