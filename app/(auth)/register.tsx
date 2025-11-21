import { RegisterScreen } from "@/src/features/auth/screens/RegisterScreen";
import { Stack } from "expo-router";
import React from "react";

export default function RegisterRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
      <RegisterScreen />
    </>
  );
}
