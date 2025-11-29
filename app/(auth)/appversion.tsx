import { AppVersionScreen } from "@/src/features/auth/screens/AppVersion";
import { Stack } from "expo-router";
import React from "react";

export default function LoginRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
      <AppVersionScreen />
    </>
  );
}
