import { Page } from "@playwright/test";

export class MainPage {
    constructor(private page: Page) {
        this.page = page;
    }

    async createNewBoard(boardName: string) {
        await this.page.getByTestId('header-create-menu-button').click();
        await this.page.getByTestId('header-create-board-button').click();
        await this.page.getByTestId('create-board-title-input').fill(boardName);
        await this.page.getByTestId('create-board-submit-button').click();
    }
}