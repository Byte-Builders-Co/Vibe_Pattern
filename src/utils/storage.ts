import AsyncStorage from "@react-native-async-storage/async-storage";
import { isString } from "./helper";

type storageKey = "token" | "theme" | "user";

/**
 * Get value from AsyncStorage
 */
export const getStoreValue = async ({
  key,
  type = "string",
}: {
  key: storageKey;
  type?: "string" | "any";
}) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null) return null;

    if (type === "string") {
      return value;
    } else {
      return JSON.parse(value);
    }
  } catch (error) {
    console.log("Error reading storage:", error);
    return null;
  }
};

/**
 * Set value in AsyncStorage
 */
export const setStoreValue = async ({
  key,
  value,
}: {
  key: storageKey;
  value: any;
}) => {
  try {
    const stringifyValue = isString(value) ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, stringifyValue);
    return true;
  } catch (error) {
    console.log("Error saving storage:", error);
    return false;
  }
};

/**
 * Remove a specific key
 */
export const removeStoreValue = async ({ key }: { key: storageKey }) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.log("Error removing storage value:", error);
    return false;
  }
};

/**
 * Clear all stored values
 */
export const clearStore = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.log("Error clearing storage:", error);
    return false;
  }
};
