import * as SecureStore from "expo-secure-store";
import type { User } from "./types";

const TOKEN_KEY = "inklink_token";
const USER_KEY = "inklink_user";

export async function saveAuth(token: string, user: User): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function loadAuth(): Promise<{ token: string; user: User } | null> {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  const userStr = await SecureStore.getItemAsync(USER_KEY);
  if (!token || !userStr) return null;
  try {
    const user = JSON.parse(userStr) as User;
    return { token, user };
  } catch {
    return null;
  }
}

export async function clearAuth(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
}
