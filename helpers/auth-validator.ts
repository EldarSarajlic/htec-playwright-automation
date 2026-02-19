import { existsSync, unlinkSync, readFileSync } from 'fs';
import { request } from '@playwright/test';

export async function isAuthValid(authFilePath: string): Promise<boolean> { 
  if (!existsSync(authFilePath)) {
    console.log('No auth state found');
    return false;
  }

  try {
    const authData = JSON.parse(readFileSync(authFilePath, 'utf-8'));

    if (!authData.cookies || authData.cookies.length === 0) {
      console.log('No cookies found - deleting');
      unlinkSync(authFilePath);
      return false;
    }

    console.log('Validating session with API call...');
    
    const apiContext = await request.newContext({ storageState: authFilePath });
    const response = await apiContext.get(process.env.USERMANAGEMENT_URL!);
    await apiContext.dispose();

    const finalUrl = response.url();
    const isValid = !finalUrl.includes('/auth/login');

    if (!isValid) {
      console.log('Session expired (redirected to login) - deleting');
      unlinkSync(authFilePath);
      return false;
    }

    console.log('Session valid - reusing auth');
    return true;

  } catch (error) {
    console.log('Session validation failed - deleting');
    unlinkSync(authFilePath);
    return false;
  }
}