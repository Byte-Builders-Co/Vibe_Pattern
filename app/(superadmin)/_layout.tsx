import { Stack } from "expo-router";

export default function SuperAdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        gestureEnabled: true,
        gestureDirection: "horizontal",
      }}
    >
      <Stack.Screen name="dashboard" />
    </Stack>
  );
}
