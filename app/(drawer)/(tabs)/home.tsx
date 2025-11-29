import { useUser } from "@/src/context";
import { AdminHomeScreen } from "@/src/features/tab/screens/home";
import UserHomeScreen from "@/src/features/tab/screens/home/UserHomeScreen";
import { Stack } from "expo-router";
import React from "react";

export default function HomeRoute() {
  const { userRole } = useUser();
  return (
    <>
      <Stack.Screen options={{ gestureEnabled: false }} />
      {userRole.admin ? <AdminHomeScreen /> : <UserHomeScreen />}
    </>
  );
}
