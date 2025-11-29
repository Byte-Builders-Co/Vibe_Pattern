import { createContext, FC, ReactNode, useContext, useState } from "react";
import { useColorScheme } from "react-native";
import { themedColors } from "../theme";
import { isEmpty } from "../utils/helper";
import { getStoreValue, setStoreValue } from "../utils/storage";

interface ThemeContextProps {
  isDark: boolean;
  theme: typeof themedColors.light;
  toggleTheme: () => void;
}

type ThemeType = "light" | "dark";

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTheme, setActiveTheme] = useState<ThemeType>("light");

  const deviceTheme = useColorScheme();

  // useLayoutEffect(() => {
  //   changeThemeBaseOnDevice();
  //   getThemeDetails();
  // }, [deviceTheme]);

  const changeThemeBaseOnDevice = () => {
    if (!isEmpty(deviceTheme)) {
      setActiveTheme(deviceTheme as ThemeType);
      setStoreValue({ key: "theme", value: deviceTheme });
    }
  };

  const getThemeDetails = async () => {
    const selectedTheme = await getStoreValue({ key: "theme" });
    if (!isEmpty(selectedTheme)) {
      setActiveTheme(selectedTheme as ThemeType);
    }
  };

  const toggleTheme = () => {
    try {
      const updatedTheme = activeTheme === "light" ? "dark" : "light";
      setActiveTheme(updatedTheme);
      setStoreValue({ key: "theme", value: updatedTheme });
    } catch (e) {
      console.log("Failed to save theme:", e);
    }
  };

  const theme = themedColors[activeTheme];
  const isDark = activeTheme === "dark";

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
