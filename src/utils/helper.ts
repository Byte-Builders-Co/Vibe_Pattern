export const isString = (value: any): boolean => {
  return typeof value === "string" || value instanceof String;
};

export const isEmpty = (value: any): boolean => {
  if (value == null) return true; // null or undefined

  if (typeof value === "string") {
    return value.trim() === "";
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === "object") {
    return Object.keys(value).length === 0;
  }

  return false; // numbers, booleans, functions, etc. are not "empty"
};
