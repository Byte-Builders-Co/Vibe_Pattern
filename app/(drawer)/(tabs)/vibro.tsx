import { getVibrationPatterns } from "@/src/services/loadPatterns";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";

export default function VibroScreen() {
  const patterns = getVibrationPatterns();
  const [activePatternId, setActivePatternId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const menuAnim = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRunningRef = useRef(false);

  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
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
      }).start(() => setIsMenuOpen(false));
    } else {
      setIsMenuOpen(true);
      Animated.timing(menuAnim, {
        toValue: 1,
        duration: 200,
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

    const runPattern = () => {
      if (!isRunningRef.current) return;

      Vibration.vibrate(pattern, true);

      const totalDuration = pattern.reduce((acc, val) => acc + val, 0);
      let elapsed = 0;
      let currentStepIndex = 0;

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        if (!isRunningRef.current) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return;
        }

        elapsed += 50;
        const loopedElapsed = elapsed % totalDuration;
        const newProgress = loopedElapsed / totalDuration;
        setProgress(newProgress);

        let timeSum = 0;
        for (let i = 0; i < pattern.length; i++) {
          timeSum += pattern[i];
          if (loopedElapsed <= timeSum) {
            if (currentStepIndex !== i) {
              setCurrentStep(i);
              currentStepIndex = i;

              if (i % 2 === 0 && pattern[i] > 0) {
                Animated.sequence([
                  Animated.timing(pulseAnim, {
                    toValue: 1.3,
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

    runPattern();
  };

  const handleVibrate = (pattern: number[], id: string, item: any) => {
    if (activePatternId === id) {
      stopVibration();
      setSelectedPattern(null);
      return;
    }

    if (activePatternId) {
      stopVibration();
    }

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

  const renderStepIndicator = (pattern: number[]) => {
    const totalDuration = pattern.reduce((acc, val) => acc + val, 0);
    const currentStepType =
      currentStep % 2 === 0 && pattern[currentStep] > 0 ? "Vibration" : "Pause";
    const currentStepDuration = pattern[currentStep] || 0;

    return (
      <View style={styles.stepContainer}>
        <View style={styles.statusRow}>
          <Text style={styles.statusText}>
            Step {currentStep + 1}/{pattern.length} • {currentStepType} •{" "}
            {currentStepDuration}ms
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
          contentContainerStyle={styles.stepsScrollContent}
        >
          {pattern.map((duration, index) => {
            const isActive = index === currentStep;
            const isPast = index < currentStep;
            const isVibration = index % 2 === 0 && duration > 0;

            return (
              <View
                key={index}
                style={[
                  styles.stepDot,
                  isVibration ? styles.stepDotVibration : styles.stepDotPause,
                  isPast && styles.stepDotPast,
                  isActive && styles.stepDotActive,
                ]}
              >
                {isActive && (
                  <Animated.View
                    style={[
                      styles.activeRing,
                      {
                        transform: [{ scale: pulseAnim }],
                      },
                    ]}
                  />
                )}
                <Text
                  style={[
                    styles.stepNumber,
                    (isActive || isPast) && styles.stepNumberActive,
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const getPatternFrequency = (pattern: number[]) => {
    const vibrationDurations = pattern.filter(
      (_, index) => index % 2 === 0 && pattern[index] > 0
    );
    if (vibrationDurations.length === 0) return "N/A";

    const avgVibration =
      vibrationDurations.reduce((a, b) => a + b, 0) / vibrationDurations.length;

    if (avgVibration < 100) return "Fast";
    if (avgVibration < 300) return "Medium";
    return "Slow";
  };

  const renderSelectedPattern = () => {
    if (!selectedPattern) return null;

    const isPlaying = activePatternId === selectedPattern.id;
    const totalDuration = selectedPattern.pattern.reduce(
      (a: number, b: number) => a + b,
      0
    );
    const frequency = getPatternFrequency(selectedPattern.pattern);

    return (
      <View style={styles.selectedPatternContainer}>
        <View style={[styles.selectedCard, isPlaying && styles.cardActive]}>
          <View style={styles.selectedCardContent}>
            <View style={styles.iconContainer}>
              <Animated.View
                style={[
                  styles.icon,
                  isPlaying && styles.iconActive,
                  isPlaying && {
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              >
                <Text style={styles.iconText}>{isPlaying ? "🔊" : "📳"}</Text>
              </Animated.View>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.patternName}>{selectedPattern.name}</Text>
              <View style={styles.statsRow}>
                <Text style={styles.patternStats}>
                  {selectedPattern.pattern.length} steps • {totalDuration}ms •{" "}
                  {frequency}
                </Text>
              </View>
              <Text style={styles.patternPreview} numberOfLines={1}>
                {selectedPattern.pattern
                  .map(
                    (dur: number, idx: number) =>
                      `${idx % 2 === 0 ? "V" : "P"}${dur}`
                  )
                  .join(" ")}
              </Text>
            </View>

            <View style={styles.playContainer}>
              <TouchableOpacity
                style={[
                  styles.playButton,
                  isPlaying && styles.playButtonActive,
                ]}
                onPress={() =>
                  handleVibrate(
                    selectedPattern.pattern,
                    selectedPattern.id,
                    selectedPattern
                  )
                }
              >
                <Text
                  style={[styles.playIcon, isPlaying && styles.playIconActive]}
                >
                  {isPlaying ? "⏹" : "▶"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {isPlaying && renderStepIndicator(selectedPattern.pattern)}
        </View>
      </View>
    );
  };

  const renderMenuItems = () => {
    return patterns.map((item, index) => {
      const translateY = menuAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -(index + 1) * 70],
      });

      const opacity = menuAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      });

      return (
        <Animated.View
          key={item.id}
          style={[
            styles.menuItem,
            {
              transform: [{ translateY }],
              opacity,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.menuItemButton}
            onPress={() => handleVibrate(item.pattern, item.id, item)}
          >
            <View style={styles.menuItemIcon}>
              <Text style={styles.menuItemIconText}>
                {activePatternId === item.id ? "🔊" : "📳"}
              </Text>
            </View>
            <View style={styles.menuItemTextContainer}>
              <Text style={styles.menuItemText}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>📳 Vibration Patterns</Text>
        <Text style={styles.headerSubtitle}>
          {selectedPattern
            ? `Selected: ${selectedPattern.name}`
            : "Tap + button to select pattern"}
          {activePatternId && " • Tap + to stop"}
        </Text>
      </View>

      {renderSelectedPattern()}

      {!selectedPattern && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>How to Use</Text>
          <Text style={styles.instructionsText}>
            • Tap the + button to open pattern menu{"\n"}• Select a vibration
            pattern from the menu{"\n"}• The selected pattern will start
            automatically{"\n"}• Tap the + button again to stop vibration{"\n"}•
            Tap pattern card to play/pause
          </Text>
        </View>
      )}

      {/* Custom Floating Action Button */}
      <View style={styles.floatingContainer}>
        {isMenuOpen && (
          <TouchableOpacity
            style={styles.overlay}
            onPress={toggleMenu}
            activeOpacity={1}
          />
        )}

        {renderMenuItems()}

        <TouchableOpacity
          style={[
            styles.mainFloatingButton,
            activePatternId && styles.mainFloatingButtonStop,
          ]}
          onPress={handleMainAction}
          activeOpacity={0.8}
        >
          <Text style={styles.mainFloatingButtonText}>
            {activePatternId ? "⏹" : "+"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#6366f1",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#e0e7ff",
    fontWeight: "500",
  },
  selectedPatternContainer: {
    padding: 20,
    paddingTop: 16,
  },
  selectedCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 2,
    borderColor: "#f1f5f9",
    overflow: "hidden",
  },
  selectedCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  cardActive: {
    borderColor: "#6366f1",
    shadowColor: "#6366f1",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  iconContainer: {
    marginRight: 14,
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#eef2ff",
    justifyContent: "center",
    alignItems: "center",
  },
  iconActive: {
    backgroundColor: "#dbeafe",
  },
  iconText: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  patternName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  patternStats: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  patternPreview: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "600",
    fontFamily: "monospace",
  },
  playContainer: {
    marginLeft: 4,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eef2ff",
    justifyContent: "center",
    alignItems: "center",
  },
  playButtonActive: {
    backgroundColor: "#fee2e2",
  },
  playIcon: {
    fontSize: 18,
    color: "#6366f1",
  },
  playIconActive: {
    color: "#dc2626",
  },
  stepContainer: {
    padding: 16,
    paddingTop: 12,
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
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    flex: 1,
  },
  loopBadge: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  loopText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    marginBottom: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6366f1",
    borderRadius: 3,
  },
  stepsScrollContent: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 4,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    position: "relative",
  },
  stepDotVibration: {
    backgroundColor: "#dbeafe",
    borderColor: "#93c5fd",
  },
  stepDotPause: {
    backgroundColor: "#f3f4f6",
    borderColor: "#d1d5db",
  },
  stepDotActive: {
    backgroundColor: "#6366f1",
    borderColor: "#4f46e5",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  stepDotPast: {
    backgroundColor: "#a5b4fc",
    borderColor: "#818cf8",
    opacity: 0.7,
  },
  activeRing: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#6366f1",
    borderRadius: 16,
    opacity: 0.4,
  },
  stepNumber: {
    fontSize: 11,
    fontWeight: "800",
    color: "#64748b",
  },
  stepNumberActive: {
    color: "#ffffff",
  },
  instructionsContainer: {
    position: "absolute",
    top: "40%",
    left: 20,
    right: 20,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
    textAlign: "center",
  },
  instructionsText: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 22,
    textAlign: "center",
  },
  // Custom Floating Action Styles
  floatingContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: -1000,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  menuItem: {
    position: "absolute",
    right: 0,
    marginBottom: 10,
  },
  menuItemButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366f1",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  menuItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  menuItemIconText: {
    fontSize: 16,
    color: "#ffffff",
  },
  menuItemTextContainer: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  menuItemText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  mainFloatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mainFloatingButtonStop: {
    backgroundColor: "#dc2626",
  },
  mainFloatingButtonText: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
  },
});
