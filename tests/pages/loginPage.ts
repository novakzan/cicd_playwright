import { Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('https://demowebshop.tricentis.com/');
    await expect(this.page).toHaveTitle(/Demo Web Shop/i);
  }

  async login(email: string, password: string) {
    await this.page.getByRole('link', { name: /log in/i }).click();
    await this.page.getByLabel('Email:').fill(email);
    await this.page.getByLabel('Password:').fill(password);
    await this.page.getByRole('button', { name: /log in/i }).click();
    await expect(this.page.getByRole('link', { name: email })).toBeVisible();
  }
}