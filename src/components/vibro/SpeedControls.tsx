import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type SpeedControlsProps = {
  speed: number;
  onChangeSpeed: (speed: number) => void;
};

export const SpeedControls: React.FC<SpeedControlsProps> = ({
  speed,
  onChangeSpeed,
}) => {
  return (
    <View style={styles.spdBox}>
      <View style={styles.spdRow}>
        {[1, 2, 3].map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.spdBtn, speed === s && styles.spdAct]}
            onPress={() => onChangeSpeed(s)}
          >
            <Text style={[styles.spdTxt, speed === s && styles.spdTxtA]}>
              {s}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.spdBtn, styles.spdPrem]}
          onPress={() => onChangeSpeed(4)}
        >
          <Text style={styles.premIco}>👑</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.spdBtn, styles.spdPrem]}
          onPress={() => onChangeSpeed(5)}
        >
          <Text style={styles.premIco}>👑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  spdBox: { paddingHorizontal: 24, paddingBottom: 14 },
  spdRow: {
    flexDirection: "row",
    backgroundColor: "#f4f4f5",
    borderRadius: 26,
    padding: 4,
  },
  spdBtn: {
    flex: 1,
    paddingVertical: 11,
    alignItems: "center",
    borderRadius: 22,
  },
  spdAct: { backgroundColor: "#ede9fe" },
  spdTxt: { fontSize: 15, fontWeight: "600", color: "#a1a1aa" },
  spdTxtA: { color: "#a855f7" },
  spdPrem: { backgroundColor: "#a855f7" },
  premIco: { fontSize: 14 },
});
