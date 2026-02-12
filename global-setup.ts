import { chromium, FullConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { LoginPage } from './pages/LoginPage';
import { isAuthValid } from './helpers/auth-validator';

dotenv.config({ path: path.resolve(__dirname, '.env.dev') });

const AUTH_FILE_PATH = 'playwright/.auth/admin.json';

async function globalSetup(config: FullConfig) {
  
  //Reuse auth session
  if (isAuthValid(AUTH_FILE_PATH)) {
    console.log('Skipping login - reusing valid auth');
    return;
  }

  // Create fresh auth
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    page.setDefaultTimeout(60000);         
    page.setDefaultNavigationTimeout(60000);  //added because OrangeHRM is slow

    const loginPage = new LoginPage(page);
    await loginPage.LoginUser(
      process.env.ADMIN_USERNAME!,
      process.env.ADMIN_PASSWORD!
    );

    await loginPage.verifySuccessfulLogin();
    await context.storageState({ path: AUTH_FILE_PATH });
    console.log('Fresh auth saved');

  } catch (error) {
    console.error('Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;