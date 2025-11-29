import { Stack } from "expo-router";

import { CustomDrawer } from "@/src/components/CustomDrawer";
import { DrawerProvider } from "@/src/components/DrawerContext";
import { ThemeProvider, UserProvider } from "@/src/context";
import { ToastProvider } from "@/src/context/ToastContext";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <DrawerProvider>
      <ThemeProvider>
        <ToastProvider>
          <UserProvider>
            <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="+not-found" />
              </Stack>
              <CustomDrawer />
            </SafeAreaView>
          </UserProvider>
        </ToastProvider>
      </ThemeProvider>
    </DrawerProvider>
  );
}

const styles = StyleSheet.create({});
