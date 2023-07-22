import { Page, expect } from "@playwright/test";

export class MainPage {
    constructor(private page: Page) {
        this.page = page;
    }

    async createNewBoard(boardName: string): Promise<this> {
        await this.page.getByTestId('header-create-menu-button').click();
        await this.page.getByTestId('header-create-board-button').click();
        await this.page.getByTestId('create-board-title-input').fill(boardName);
        await this.page.getByTestId('create-board-submit-button').click();
        return this;
    }

    async assertIsCreated() {
        await expect(this.page.locator('*[data-testid="board-name-display"]')).toHaveText('testsetsdf');
    }
}