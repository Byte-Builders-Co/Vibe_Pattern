import { TextStyle } from "react-native";
import { colors } from "./colors";

export const typography = {
  title: { fontSize: 20, fontWeight: "600" as const },
  subtitle: { fontSize: 16, fontWeight: "500" as const },
  body: { fontSize: 14 } as const,
  small: { fontSize: 12 } as const,
  h1: { fontSize: 32, fontWeight: "700" as const },
  h2: { fontSize: 24, fontWeight: "600" as const },
  h3: { fontSize: 20, fontWeight: "600" as const },
  caption: { fontSize: 14, fontWeight: "400" as const },
};

export const fontSize = {
  xxl: { fontSize: 36 },
  xl: { fontSize: 24 },
  lg: { fontSize: 20 },
  md: { fontSize: 18 },
  sm: { fontSize: 16 },
  xs: { fontSize: 14 },
  xxs: { fontSize: 12 },
};

export const fontWeight: Record<
  "bold" | "semibold" | "medium" | "regular" | "light",
  TextStyle
> = {
  bold: { fontWeight: "bold" },
  semibold: { fontWeight: "600" },
  medium: { fontWeight: "500" },
  regular: { fontWeight: "400" },
  light: { fontWeight: "300" },
};

export const textColor = {
  default: { color: colors.black },
  primary: { color: colors.primary },
  secondary: { color: colors.secondary },
  error: { color: colors.red },
};
