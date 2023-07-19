import { Page } from "@playwright/test";

export class CardPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public get attachmentButton(): string {
        return '.window-sidebar .js-react-root button [data-testid="AttachmentIcon"]';
    }

    public get cardFileInput(): string {
        return '#card-attachment-file-picker';
    }
}