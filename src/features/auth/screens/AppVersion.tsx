import { colors } from "@/src/theme";
import React, { FC } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";

interface AppVersionScreenProps {}

export const AppVersionScreen: FC<AppVersionScreenProps> = ({}) => {
  const appInfo = {
    version: "1.2.0",
    buildNumber: "42",
    lastUpdated: "December 15, 2023",
    features: [
      "Bug fixes and performance improvements",
      "Enhanced security features",
      "Improved performance",
    ],
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>App Version</Text>
        <Text style={styles.subtitle}>Current version information</Text>
      </View>

      {/* Version Info Card */}
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Version</Text>
          <Text style={styles.value}>{appInfo.version}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Build Number</Text>
          <Text style={styles.value}>{appInfo.buildNumber}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Platform</Text>
          <Text style={styles.value}>
            {Platform.OS === "ios" ? "iOS" : "Android"}
          </Text>
        </View>

        <View style={[styles.infoRow, styles.lastInfoRow]}>
          <Text style={styles.label}>Last Updated</Text>
          <Text style={styles.value}>{appInfo.lastUpdated}</Text>
        </View>
      </View>

      {/* What's New Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>What's New</Text>
        {appInfo.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <View style={styles.bulletContainer}>
              <Text style={styles.bullet}>•</Text>
            </View>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2024 Your App Name. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lastInfoRow: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  label: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  bulletContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  bullet: {
    fontSize: 18,
    color: colors.secondary,
    fontWeight: "bold",
  },
  featureText: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
    lineHeight: 22,
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
