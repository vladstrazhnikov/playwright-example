import { Page } from "@playwright/test";

export class LoginPage {
    private page: Page;
    private loginButton = 'a[data-uuid$="login"]';
    private usernameInput = '#user';
    private continueButton = '#login';
    private passwordInput = '#password';
    private loginSubmitButton = '#login-submit';

    constructor(page: Page) {
        this.page = page;
    }

    async login(username: string, password: string) {
        await this.page.click(this.loginButton);
        await this.page.fill(this.usernameInput, username);
        await this.page.click(this.continueButton);
        await this.page.fill(this.passwordInput, password);
        await this.page.click(this.loginSubmitButton);
    }
}