import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SW, height: SH } = Dimensions.get("window");

type PatternGridModalProps = {
  visible: boolean;
  patterns: any[];
  selectedIndex: number;
  onClose: () => void;
  onSelectPattern: (index: number) => void;
};

const getPatIcon = (pattern: any) => {
  return pattern?.icon || "📊";
};

export const PatternGridModal: React.FC<PatternGridModalProps> = ({
  visible,
  patterns,
  selectedIndex,
  onClose,
  onSelectPattern,
}) => {
  const modalAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(modalAnim, {
        toValue: 1,
        friction: 8,
        tension: 65,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(modalAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, modalAnim]);

  const handleClose = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.modalBg}>
        <Animated.View
          style={[
            styles.modalBox,
            {
              transform: [
                {
                  translateY: modalAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [SH, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.modalHead}>
            <Text style={styles.modalTitle}>Patterns</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
              <Text style={styles.closeTxt}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.gridScroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.grid}>
              {patterns.map((p, i) => {
                const isSel = selectedIndex === i;
                const isLocked = p.premium || false;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={styles.gridItem}
                    onPress={() => !isLocked && onSelectPattern(i)}
                    activeOpacity={isLocked ? 0.6 : 0.8}
                  >
                    <View
                      style={[
                        styles.gridCircle,
                        isSel && styles.gridCircleSel,
                        isLocked && styles.gridLocked,
                      ]}
                    >
                      {isLocked ? (
                        <View style={styles.lockContainer}>
                          <Text style={styles.lockIco}>🔒</Text>
                          <Text style={styles.premiumBadge}>👑</Text>
                        </View>
                      ) : (
                        <Text style={styles.gridIco}>{getPatIcon(p)}</Text>
                      )}
                    </View>
                    <Text
                      style={[styles.gridName, isSel && styles.gridNameSel]}
                      numberOfLines={1}
                    >
                      {p.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
  modalBox: {
    flex: 1,
    marginTop: 60,
    backgroundColor: "#fafafa",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    elevation: 20,
    shadowColor: "#a855f7",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  modalHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "300",
    color: "#c9b8cf",
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  closeTxt: { fontSize: 15, color: "#6b7280" },
  gridScroll: { flex: 1 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  gridItem: {
    width: (SW - 48) / 3,
    alignItems: "center",
    marginBottom: 20,
  },
  gridCircle: {
    width: (SW - 80) / 3,
    height: (SW - 80) / 3,
    borderRadius: (SW - 80) / 6,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#a855f7",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  gridCircleSel: {
    borderWidth: 4,
    borderColor: "#a855f7",
    backgroundColor: "#f8f4ff",
  },
  gridLocked: {
    backgroundColor: "#e9d5ff",
    opacity: 0.8,
    borderColor: "#d8b4fe",
  },
  gridIco: { fontSize: 28 },
  lockContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  lockIco: { fontSize: 24 },
  premiumBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    fontSize: 14,
  },
  gridName: {
    fontSize: 11,
    color: "#a1a1aa",
    marginTop: 6,
    textAlign: "center",
  },
  gridNameSel: { color: "#7c3aed", fontWeight: "600" },
});
