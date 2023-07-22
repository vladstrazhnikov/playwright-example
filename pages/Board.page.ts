import { Page } from "@playwright/test";

export class BoardPage {
    constructor(private page: Page) {
        this.page = page;
    }

    public get firstCard(): string {
        return 'div[data-testid="list"]:first-of-type a[data-testid="trello-card"]';
    }

    public get secondList(): string {
        return 'div[data-testid="list"]:nth-of-type(2)';
    }

    async fillListNameInput(listName: string) {
        this.page.fill('.list-name-input', listName);
    }

    async submitListButton() {
        this.page.click('input[type="submit"]');
    }

    async clickAddCardButton() {
        this.page.click('.js-add-a-card');
    }

    async fillCardNameInput(cardName: string) {
        this.page.fill('.list-card-composer-textarea', cardName);
    }

    async submitCardButton() {
        this.page.click('.cc-controls-section input[type="submit"]');
    }

    async createCard(cardName: string): Promise<this> {
        await this.clickAddCardButton();
        await this.fillCardNameInput(cardName);
        await this.submitCardButton();
        return this;
    }
}