import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../../src/theme/colors";
import { spacing } from "../../src/theme/spacing";
import { typography } from "../../src/theme/typography";

const faqs = [
  {
    q: "How do I use the drawer?",
    a: "Tap the menu icon (☰) to open the side drawer.",
  },
  {
    q: "How do I navigate?",
    a: "Use bottom tabs for main screens or drawer for all pages.",
  },
  { q: "Can I customize themes?", a: "Yes! Edit files in src/theme/ folder." },
];

export default function HelpScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Help & FAQ</Text>
        {faqs.map((faq, idx) => (
          <View key={idx} style={styles.card}>
            <Text style={styles.question}>{faq.q}</Text>
            <Text style={styles.answer}>{faq.a}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
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
  },
  question: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
  answer: { ...typography.body, color: colors.textSecondary },
});
