import DashBoardScreen from "@/src/features/superadmin/screens/DashBoardScreen";
import { Stack } from "expo-router";
import React from "react";

export default function RegisterRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
      <DashBoardScreen />
    </>
  );
}
