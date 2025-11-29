/**
 * Helper function to get session token from browser cookies
 */
export function getSessionTokenFromBrowser(): string | undefined {
    return document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${process.env.SESSION_COOKIE || 'session'}=`))
        ?.split('=')[1];
}
