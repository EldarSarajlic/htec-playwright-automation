import {test,expect, Locator} from "@playwright/test"
import { exec } from "node:child_process";

test("Testing Locators", async ({page})=>{
    await page.goto("https://demo.nopcommerce.com/");
    // const logo:Locator = page.getByAltText("nopCommerce demo store");;;;
    // await expect(logo).toBeVisible();

    // await expect(page.getByText("Welcome to our store")).toBeVisible();
    // await expect(page.getByText(/Welcome\s+To\s+Our\s+Store/i)).toBeVisible();

    // await expect(page.getByRole("heading", {name: "Register"})).toBeVisible();
    // await page.getByPlaceholder("Search store").fill("Apple")
    // await page.getByLabel("First name").fill("John");
    // await page.getByLabel("Last name").fill("Doe");
    // await page.getByLabel("Email").fill("randomMail@temp.org");

    await page.route("**/turnstile/**", route => route.abort());
    await page.route("**cloudflare**", route => route.abort());
    await page.route("**/challenge**", route => route.abort());

    await page.getByRole('link', {name: 'Register'}).click();
    await page.waitForTimeout(1000);

    await expect(page.getByRole('heading', {name:'Register'})).toBeVisible();
    await page.waitForTimeout(1000);

    await page.getByLabel('First name').fill("John");
    await page.waitForTimeout(1000);

    await page.getByLabel('Last name').fill("Doe");
    await page.waitForTimeout(1000);
}) 