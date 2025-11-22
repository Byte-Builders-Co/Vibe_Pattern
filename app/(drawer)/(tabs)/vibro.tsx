import { getVibrationPatterns } from "@/src/services/loadPatterns";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const RADIUS = 120;
const ITEM_SIZE = 54;
const VISIBLE_ITEMS = 5; // Number of items visible in the arc
const ARC_SPREAD = Math.PI; // Full semi-circle

export default function VibroScreen() {
  const patterns = getVibrationPatterns();
  const [activePatternId, setActivePatternId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const menuAnim = useRef(new Animated.Value(0)).current;
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRunningRef = useRef(false);
  const lastScrollY = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        lastScrollY.current = scrollOffset;
      },
      onPanResponderMove: (_, gestureState) => {
        const maxOffset = Math.max(0, patterns.length - VISIBLE_ITEMS);
        const newOffset = lastScrollY.current - gestureState.dy / 40;
        const clampedOffset = Math.max(0, Math.min(maxOffset, newOffset));
        setScrollOffset(clampedOffset);
      },
      onPanResponderRelease: (_, gestureState) => {
        const maxOffset = Math.max(0, patterns.length - VISIBLE_ITEMS);
        const newOffset = lastScrollY.current - gestureState.dy / 40;
        const clampedOffset = Math.max(0, Math.min(maxOffset, newOffset));
        const rounded = Math.round(clampedOffset);
        setScrollOffset(rounded);
      },
    })
  ).current;

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      Vibration.cancel();
      isRunningRef.current = false;
    };
  }, []);

  const toggleMenu = () => {
    if (isMenuOpen) {
      Animated.timing(menuAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setIsMenuOpen(false);
        setScrollOffset(0);
      });
    } else {
      setIsMenuOpen(true);
      Animated.spring(menuAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };

  const stopVibration = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    Vibration.cancel();
    isRunningRef.current = false;
    setActivePatternId(null);
    setCurrentStep(0);
    setProgress(0);
  };

  const startInfiniteVibration = (pattern: number[], id: string) => {
    isRunningRef.current = true;
    setActivePatternId(id);
    setCurrentStep(0);
    setProgress(0);
    Vibration.vibrate(pattern, true);
    const totalDuration = pattern.reduce((acc, val) => acc + val, 0);
    let elapsed = 0;
    let stepIndex = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isRunningRef.current) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }
      elapsed += 50;
      const looped = elapsed % totalDuration;
      setProgress(looped / totalDuration);
      let sum = 0;
      for (let i = 0; i < pattern.length; i++) {
        sum += pattern[i];
        if (looped <= sum) {
          if (stepIndex !== i) {
            setCurrentStep(i);
            stepIndex = i;
            if (i % 2 === 0 && pattern[i] > 0) {
              Animated.sequence([
                Animated.timing(pulseAnim, {
                  toValue: 1.2,
                  duration: 50,
                  useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                  toValue: 1,
                  duration: 100,
                  useNativeDriver: true,
                }),
              ]).start();
            }
          }
          break;
        }
      }
    }, 50);
  };

  const handleVibrate = (pattern: number[], id: string, item: any) => {
    if (activePatternId === id) {
      stopVibration();
      setSelectedPattern(null);
      return;
    }
    if (activePatternId) stopVibration();
    setSelectedPattern(item);
    startInfiniteVibration(pattern, id);
    toggleMenu();
  };

  const handleMainAction = () => {
    if (activePatternId) {
      stopVibration();
      setSelectedPattern(null);
    } else {
      toggleMenu();
    }
  };

  const getPatternFrequency = (pattern: number[]) => {
    const vibs = pattern.filter((_, i) => i % 2 === 0 && pattern[i] > 0);
    if (!vibs.length) return "N/A";
    const avg = vibs.reduce((a, b) => a + b, 0) / vibs.length;
    return avg < 100 ? "Fast" : avg < 300 ? "Medium" : "Slow";
  };

  const renderStepIndicator = (pattern: number[]) => {
    const type =
      currentStep % 2 === 0 && pattern[currentStep] > 0 ? "Vibration" : "Pause";
    const dur = pattern[currentStep] || 0;
    return (
      <View style={styles.stepContainer}>
        <View style={styles.statusRow}>
          <Text style={styles.statusText}>
            Step {currentStep + 1}/{pattern.length} • {type} • {dur}ms
          </Text>
          <View style={styles.loopBadge}>
            <Text style={styles.loopText}>∞ LOOP</Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stepsScroll}
        >
          {pattern.map((d, i) => {
            const active = i === currentStep;
            const past = i < currentStep;
            const isVib = i % 2 === 0 && d > 0;
            return (
              <View
                key={i}
                style={[
                  styles.stepDot,
                  isVib ? styles.stepVib : styles.stepPause,
                  past && styles.stepPast,
                  active && styles.stepActive,
                ]}
              >
                {active && (
                  <Animated.View
                    style={[
                      styles.activeRing,
                      { transform: [{ scale: pulseAnim }] },
                    ]}
                  />
                )}
                <Text
                  style={[
                    styles.stepNum,
                    (active || past) && styles.stepNumActive,
                  ]}
                >
                  {i + 1}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderSelectedPattern = () => {
    if (!selectedPattern) return null;
    const playing = activePatternId === selectedPattern.id;
    const total = selectedPattern.pattern.reduce(
      (a: number, b: number) => a + b,
      0
    );
    const freq = getPatternFrequency(selectedPattern.pattern);
    return (
      <View style={styles.selectedContainer}>
        <View style={[styles.selectedCard, playing && styles.cardActive]}>
          <View style={styles.cardContent}>
            <Animated.View
              style={[
                styles.cardIcon,
                playing && styles.cardIconActive,
                playing && { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <Text style={styles.cardIconText}>{playing ? "🔊" : "📳"}</Text>
            </Animated.View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{selectedPattern.name}</Text>
              <Text style={styles.cardStats}>
                {selectedPattern.pattern.length} steps • {total}ms • {freq}
              </Text>
              <Text style={styles.cardPreview} numberOfLines={1}>
                {selectedPattern.pattern
                  .map(
                    (d: number, i: number) => `${i % 2 === 0 ? "V" : "P"}${d}`
                  )
                  .join(" ")}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.cardPlay, playing && styles.cardPlayActive]}
              onPress={() =>
                handleVibrate(
                  selectedPattern.pattern,
                  selectedPattern.id,
                  selectedPattern
                )
              }
            >
              <Text
                style={[
                  styles.cardPlayIcon,
                  playing && styles.cardPlayIconActive,
                ]}
              >
                {playing ? "⏹" : "▶"}
              </Text>
            </TouchableOpacity>
          </View>
          {playing && renderStepIndicator(selectedPattern.pattern)}
        </View>
      </View>
    );
  };

  const renderMenu = () => {
    if (!isMenuOpen) return null;
    const totalItems = patterns.length;
    const maxOffset = Math.max(0, totalItems - VISIBLE_ITEMS);
    const showScrollIndicator = totalItems > VISIBLE_ITEMS;

    return (
      <View style={styles.menuWrapper} {...panResponder.panHandlers}>
        <TouchableOpacity
          style={styles.menuBackdrop}
          onPress={toggleMenu}
          activeOpacity={1}
        />

        {showScrollIndicator && scrollOffset > 0 && (
          <Animated.View
            style={[
              styles.scrollIndicator,
              styles.scrollIndicatorLeft,
              { opacity: menuAnim },
            ]}
          >
            <Text style={styles.scrollArrow}>◀</Text>
          </Animated.View>
        )}

        {showScrollIndicator && scrollOffset < maxOffset && (
          <Animated.View
            style={[
              styles.scrollIndicator,
              styles.scrollIndicatorRight,
              { opacity: menuAnim },
            ]}
          >
            <Text style={styles.scrollArrow}>▶</Text>
          </Animated.View>
        )}

        {patterns.map((item, idx) => {
          const visiblePosition = idx - scrollOffset;
          if (visiblePosition < -0.5 || visiblePosition > VISIBLE_ITEMS - 0.5)
            return null;

          const angleStep =
            VISIBLE_ITEMS > 1 ? ARC_SPREAD / (VISIBLE_ITEMS - 1) : 0;
          const angle = Math.PI - visiblePosition * angleStep;
          const x = RADIUS * Math.cos(angle);
          const y = RADIUS * Math.sin(angle);

          const distFromCenter = Math.abs(
            visiblePosition - (VISIBLE_ITEMS - 1) / 2
          );
          const scaleFactor = 1 - distFromCenter * 0.1;
          const opacityFactor = 1 - distFromCenter * 0.2;

          const translateX = menuAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, x],
          });
          const translateY = menuAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -y],
          });
          const scale = menuAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, scaleFactor],
          });
          const opacity = menuAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, opacityFactor],
          });

          return (
            <Animated.View
              key={item.id}
              style={[
                styles.menuItem,
                {
                  transform: [{ translateX }, { translateY }, { scale }],
                  opacity,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.menuBtn,
                  activePatternId === item.id && styles.menuBtnActive,
                ]}
                onPress={() => handleVibrate(item.pattern, item.id, item)}
              >
                <Text style={styles.menuBtnIcon}>
                  {activePatternId === item.id ? "🔊" : "📳"}
                </Text>
              </TouchableOpacity>
              <View style={styles.menuLabelContainer}>
                <Text style={styles.menuLabel} numberOfLines={1}>
                  {item.name}
                </Text>
              </View>
            </Animated.View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderSelectedPattern()}
      <View style={styles.fabContainer}>
        {renderMenu()}
        <TouchableOpacity
          style={[styles.fab, activePatternId && styles.fabStop]}
          onPress={handleMainAction}
          activeOpacity={0.85}
        >
          <Animated.Text
            style={[
              styles.fabText,
              {
                transform: [
                  {
                    rotate: menuAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "45deg"],
                    }),
                  },
                ],
              },
            ]}
          >
            {activePatternId ? "⏹" : "+"}
          </Animated.Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  selectedContainer: { padding: 16 },
  selectedCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    elevation: 4,
    overflow: "hidden",
  },
  cardActive: { borderColor: "#6366f1", elevation: 8 },
  cardContent: { flexDirection: "row", alignItems: "center", padding: 16 },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#eef2ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  cardIconActive: { backgroundColor: "#dbeafe" },
  cardIconText: { fontSize: 26 },
  cardText: { flex: 1 },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  cardStats: { fontSize: 13, color: "#64748b", marginBottom: 2 },
  cardPreview: { fontSize: 10, color: "#94a3b8", fontFamily: "monospace" },
  cardPlay: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#eef2ff",
    justifyContent: "center",
    alignItems: "center",
  },
  cardPlayActive: { backgroundColor: "#fee2e2" },
  cardPlayIcon: { fontSize: 20, color: "#6366f1" },
  cardPlayIconActive: { color: "#dc2626" },
  stepContainer: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    backgroundColor: "#fafbff",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statusText: { fontSize: 12, fontWeight: "600", color: "#475569" },
  loopBadge: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  loopText: { fontSize: 9, fontWeight: "800", color: "#fff" },
  progressBar: {
    height: 5,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    marginBottom: 10,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#6366f1", borderRadius: 3 },
  stepsScroll: { flexDirection: "row", gap: 6 },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  stepVib: { backgroundColor: "#dbeafe", borderColor: "#93c5fd" },
  stepPause: { backgroundColor: "#f3f4f6", borderColor: "#d1d5db" },
  stepActive: {
    backgroundColor: "#6366f1",
    borderColor: "#4f46e5",
    elevation: 4,
  },
  stepPast: {
    backgroundColor: "#a5b4fc",
    borderColor: "#818cf8",
    opacity: 0.7,
  },
  activeRing: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#6366f1",
    borderRadius: 14,
    opacity: 0.4,
  },
  stepNum: { fontSize: 10, fontWeight: "800", color: "#64748b" },
  stepNumActive: { color: "#fff" },
  fabContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  menuWrapper: {
    position: "absolute",
    bottom: 0,
    left: -SCREEN_WIDTH / 2 + 32,
    right: -SCREEN_WIDTH / 2 + 32,
    height: RADIUS + 100,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  menuBackdrop: { ...StyleSheet.absoluteFillObject },
  menuItem: { position: "absolute", alignItems: "center" },
  menuBtn: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    backgroundColor: "#b4b5f9",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  menuBtnActive: { backgroundColor: "#6366f1" },
  menuBtnIcon: { fontSize: 24 },
  menuLabelContainer: {
    position: "absolute",
    top: ITEM_SIZE + 4,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  menuLabel: {
    fontSize: 9,
    color: "#fff",
    fontWeight: "600",
    maxWidth: 70,
    textAlign: "center",
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  fabStop: { backgroundColor: "#dc2626" },
  fabText: { fontSize: 32, color: "#fff", fontWeight: "600" },
  scrollIndicator: {
    position: "absolute",
    bottom: 80,
    backgroundColor: "rgba(99,102,241,0.9)",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  scrollIndicatorLeft: { left: SCREEN_WIDTH / 2 - RADIUS - 50 },
  scrollIndicatorRight: { right: SCREEN_WIDTH / 2 - RADIUS - 50 },
  scrollArrow: { color: "#fff", fontSize: 12, fontWeight: "bold" },
});
