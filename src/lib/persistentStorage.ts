/**
 * Cross-platform persistent key/value storage.
 *
 * - Web: localStorage
 * - iOS/Android (Capacitor): @capacitor/preferences (UserDefaults / SharedPreferences)
 *
 * Uses dynamic imports so the web build stays happy even before adding iOS/Android.
 */
export async function persistentGetItem(key: string): Promise<string | null> {
  try {
    const { Capacitor } = await import("@capacitor/core");
    if (Capacitor.isNativePlatform()) {
      const { Preferences } = await import("@capacitor/preferences");
      const { value } = await Preferences.get({ key });
      return value ?? null;
    }
  } catch {
    // fall back to web
  }

  try {
    return typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

export async function persistentSetItem(key: string, value: string): Promise<void> {
  try {
    const { Capacitor } = await import("@capacitor/core");
    if (Capacitor.isNativePlatform()) {
      const { Preferences } = await import("@capacitor/preferences");
      await Preferences.set({ key, value });
      return;
    }
  } catch {
    // fall back to web
  }

  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}
