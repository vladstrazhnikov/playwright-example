import { Page } from "@playwright/test";

export class MainPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public get firstCard(): string {
        return 'div[data-testid="list"]:first-of-type a[data-testid="trello-card"]';
    }

    public get secondList(): string {
        return 'div[data-testid="list"]:nth-of-type(2)';
    }
}