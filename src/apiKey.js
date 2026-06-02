// Manages the user's optional Google Gemini API key.
// When set, this key overrides the server's built-in AI Gateway key for
// docs chat, product generation, and image generation.

const STORAGE_KEY = 'lotus_gemini_api_key';

export function getUserApiKey() {
  try {
    return localStorage.getItem(STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function setUserApiKey(key) {
  try {
    if (key && key.trim()) {
      localStorage.setItem(STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore storage failures (e.g. private mode)
  }
}

export function hasUserApiKey() {
  return !!getUserApiKey();
}
