import { LoginScreen } from "@/src/features/auth/screens/LoginScreen";
import { Stack } from "expo-router";
import React from "react";

export default function LoginRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
      <LoginScreen />
    </>
  );
}
