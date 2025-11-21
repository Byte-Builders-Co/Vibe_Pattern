import { Stack } from "expo-router";

import { CustomDrawer } from "@/src/components/CustomDrawer";
import { DrawerProvider } from "@/src/components/DrawerContext";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <DrawerProvider>
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
        </Stack>
        <CustomDrawer />
      </SafeAreaView>
    </DrawerProvider>
  );
}

const styles = StyleSheet.create({});
