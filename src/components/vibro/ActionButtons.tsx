import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ActionButtonsProps = {
  onOpenList: () => void;
};

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onOpenList }) => {
  return (
    <View style={styles.actionRow}>
      <TouchableOpacity style={styles.actBtn} onPress={onOpenList}>
        <Text style={styles.actIco}>☰</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actBtn}>
        <Text style={styles.actIco}>🔓</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingVertical: 10,
  },
  actBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#f4f4f5",
    justifyContent: "center",
    alignItems: "center",
  },
  actIco: { fontSize: 18, color: "#a1a1aa" },
});
