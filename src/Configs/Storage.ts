/**
 * Loads a string from storage.
 *
 * @param key The key to fetch.
 */
export async function loadString(key: string): Promise<string | null> {
  try {
    return await localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Saves a string to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export async function saveString(key: string, value: string): Promise<boolean> {
  try {
    await localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Loads something from storage and runs it thru JSON.parse.
 *
 * @param key The key to fetch.
 */
export async function load(key: string): Promise<any | null> {
  try {
    const storedItem = await localStorage.getItem(key);
    return JSON.parse(storedItem as string);
  } catch {
    return null;
  }
}

/**
 * Saves an object to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export async function save(key: string, value: any): Promise<boolean> {
  try {
    await localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Removes a key from storage.
 *
 * @param key The key to kill.
 */
export async function remove(key: string): Promise<boolean> {
  try {
    await localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Burn it all to the ground. useful for resetting the app's data
 */
export async function reset(): Promise<boolean> {
  try {
    await localStorage.clear();
    return true;
  } catch {
    return false;
  }
}