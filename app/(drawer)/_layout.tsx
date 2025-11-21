import CustomHeader from "@/src/components/CustomHeader";
import { useDrawer } from "@/src/components/DrawerContext";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../../src/theme/colors";
import { spacing } from "../../src/theme/spacing";

export default function DrawerLayout() {
  const { toggleDrawer } = useDrawer();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerLeft: () => (
          <TouchableOpacity onPress={toggleDrawer} style={styles.menuBtn}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="about"
        options={{
          title: "About",
          header: () => <CustomHeader title="About Us" showBackButton />,
        }}
      />
      <Stack.Screen
        name="contact"
        options={{
          title: "Contact",
          header: () => <CustomHeader title="Contact" showBackButton />,
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          title: "Help",
          header: () => <CustomHeader title="Help" showBackButton />,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  menuBtn: {
    paddingHorizontal: spacing.md,
  },
  menuIcon: {
    fontSize: 24,
    color: colors.text,
  },
});
