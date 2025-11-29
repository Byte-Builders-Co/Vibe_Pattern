import { usePathname, useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { drawerMenuItems } from "../constants/menu";
import { useUser } from "../context";
import { colors, spacing, typography } from "../theme";
import { useDrawer } from "./DrawerContext";

const DRAWER_WIDTH = 320;

export const CustomDrawer = () => {
  const { isOpen, closeDrawer } = useDrawer();
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useUser();
  const handleNav = (route: string) => {
    closeDrawer();
    router.replace(route as any);
  };

  const handellogout = async () => {
    await closeDrawer();
    logout();
  };
  if (!isOpen) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <TouchableWithoutFeedback onPress={closeDrawer}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View style={styles.drawer}>
        <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>john@example.com</Text>
          </View>

          <View style={styles.menuContainer}>
            {drawerMenuItems.map((item, idx) => {
              const isActive = pathname.includes(
                item.route.split("/").pop() || ""
              );
              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.menuItem, isActive && styles.menuItemActive]}
                  onPress={() => handleNav(item.route)}
                >
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <Text
                    style={[
                      styles.menuLabel,
                      isActive && styles.menuLabelActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.logoutBtn} onPress={handellogout}>
              <Text style={styles.logoutText}>🚪 Logout</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: colors.surface,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xxl,
    backgroundColor: colors.primary,
    alignItems: "center",
    borderTopRightRadius: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  avatarText: {
    ...typography.h2,
    color: colors.primary,
    fontWeight: "bold",
  },
  userName: {
    ...typography.h3,
    color: colors.white,
    fontWeight: "600",
    marginBottom: 4,
  },
  userEmail: {
    ...typography.caption,
    color: colors.white,
    opacity: 0.9,
  },
  menuContainer: {
    flex: 1,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginHorizontal: spacing.sm,
    borderRadius: 12,
    marginBottom: 4,
  },
  menuItemActive: {
    backgroundColor: colors.primary + "20",
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: spacing.md,
    width: 24,
    textAlign: "center",
  },
  menuLabel: {
    ...typography.body,
    color: colors.text,
    fontSize: 16,
  },
  menuLabelActive: {
    color: colors.primary,
    fontWeight: "600",
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border + "50",
    marginTop: spacing.md,
  },
  logoutBtn: {
    padding: spacing.md,
    alignItems: "center",
    borderRadius: 12,
  },
  logoutText: {
    ...typography.body,
    color: colors.error,
    fontWeight: "500",
  },
});
