import { existsSync, unlinkSync, readFileSync } from 'fs';

export function isAuthValid(authFilePath: string): boolean { 
  if (!existsSync(authFilePath)) {
    console.log('ℹNo auth state found');
    return false;
  }

  try {
    const authData = JSON.parse(readFileSync(authFilePath, 'utf-8'));

    if (!authData.cookies || authData.cookies.length === 0) {
      console.log('No cookies found - deleting');
      unlinkSync(authFilePath);
      return false;
    }

    // Check if ANY cookie is expired
    const now = Date.now() / 1000; // Current time in seconds 

    const hasExpiredCookie = authData.cookies.some((cookie: any) => {
      return cookie.expires !== -1              // -1 means session cookie
        && cookie.expires < now;                
    });

    if (hasExpiredCookie) {
      console.log('Cookies expired - deleting');
      unlinkSync(authFilePath);
      return false;
    }

    console.log('Cookies valid - reusing auth');
    return true;

  } catch {
    console.log('Auth file corrupted - deleting');
    unlinkSync(authFilePath);
    return false;
  }
}
