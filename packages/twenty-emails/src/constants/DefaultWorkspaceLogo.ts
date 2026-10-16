// Emails render inside the server process, so SERVER_URL is the same value the server uses for its own links.
// The fallback is Trident's pilot install, used only by the email preview tool.
export const EMAIL_BASE_URL = (
  process.env.SERVER_URL || 'https://crm.trident-ai.dev'
).replace(/\/$/, '');

export const DEFAULT_WORKSPACE_LOGO = `${EMAIL_BASE_URL}/images/icons/android/android-launchericon-192-192.png`;
