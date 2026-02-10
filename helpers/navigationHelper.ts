import { expect, Page } from "@playwright/test";

export class NavigationHelper {
    constructor(private page: Page) {}

    async navigate(url: string) {
        await this.page.goto(url);
    }

    async validateUrlPartition(urlPart: string) {
        await expect(this.page).toHaveURL(new RegExp(urlPart));
    }
}