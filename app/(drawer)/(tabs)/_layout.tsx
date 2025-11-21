import { Tabs } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import CustomHeader from "@/src/components/CustomHeader";
import { useDrawer } from "@/src/components/DrawerContext";
import { TabBar } from "@/src/components/TabBar";
import { colors } from "../../../src/theme/colors";
import { spacing } from "../../../src/theme/spacing";

export default function TabsLayout() {
  const { toggleDrawer } = useDrawer();

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
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
      <Tabs.Screen
        name="home"
        options={{ title: "Home", header: () => <CustomHeader title="Home" /> }}
      />
      <Tabs.Screen
        name="vibro"
        options={{
          title: "vibro",
          header: () => <CustomHeader title="Vibro" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          header: () => <CustomHeader title="Profile" />,
        }}
      />
    </Tabs>
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
