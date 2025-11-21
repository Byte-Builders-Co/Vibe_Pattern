import { ProfileScreen } from "@/src/features/tab/screens/ProfileScreen";
import { Stack } from "expo-router";
import React from "react";

export default function ProfilRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, gestureEnabled: false }} />
      <ProfileScreen />
    </>
  );
}
