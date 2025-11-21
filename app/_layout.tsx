import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="user/UserScreen" options={{ title: "User" }} />
      <Stack.Screen name="admin/AdminScreen" options={{ title: "Admin" }} />
    </Stack>
  );
}
