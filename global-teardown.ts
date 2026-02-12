import { FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalTeardown(config: FullConfig) {
  const authFile = path.resolve(__dirname, 'playwright/.auth/admin.json');

  try {
    if (fs.existsSync(authFile)) {
      fs.unlinkSync(authFile);
      console.log('Deleted: playwright/.auth/admin.json');
    } else {
      console.log('No auth file to clean up');
    }
  } catch (error) {
    console.error('Error during teardown:', error);
    // Don't throw - teardown errors shouldn't fail the test run
  }
  console.log('Global teardown completed');
}

export default globalTeardown;
