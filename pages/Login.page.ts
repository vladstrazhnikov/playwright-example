import { Page,expect } from "@playwright/test";

export class LoginPage {
    private page: Page;
    private loginButton = 'a[data-uuid$="login"]';
    private usernameInput = '#user';
    private continueButton = '#login';
    private passwordInput = '#password';
    private loginSubmitButton = '#login-submit';
    private headerMemberMenu = 'button[data-testid="header-member-menu-button"] div';

    constructor(page: Page) {
        this.page = page;
    }

    async login(username: string, password: string): Promise<this> {
        await this.page.click(this.loginButton);
        await this.page.fill(this.usernameInput, username);
        await this.page.click(this.continueButton);
        await this.page.fill(this.passwordInput, password);
        await this.page.click(this.loginSubmitButton);
        await this.page.waitForTimeout(2000);
        return this;
    }

    async assertIsLogged() {
        const titleAttributeValue = await this.page.getAttribute(this.headerMemberMenu, 'title');
        const expectedTitle = 'Vladislav Strazhnikov (vladislavstrazhnikov)';
        expect(titleAttributeValue).toEqual(expectedTitle);
    }
}