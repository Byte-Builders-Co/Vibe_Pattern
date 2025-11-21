import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../src/theme/colors";
import { spacing } from "../../src/theme/spacing";
import { typography } from "../../src/theme/typography";

export default function ContactScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Contact Us</Text>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.icon}>📧</Text>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>support@example.com</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.icon}>📱</Text>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>+1 234 567 890</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  title: { ...typography.h1, color: colors.text, marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    alignItems: "center",
  },
  icon: { fontSize: 40, marginBottom: spacing.sm },
  label: { ...typography.h3, color: colors.text },
  value: { ...typography.body, color: colors.primary },
});
