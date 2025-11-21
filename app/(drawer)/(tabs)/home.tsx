import { getVibrationPatterns } from "@/src/services/loadPatterns";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";

export default function HomeScreen() {
  const patterns = getVibrationPatterns();
  const [activePatternId, setActivePatternId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      Vibration.cancel();
      isRunningRef.current = false;
    };
  }, []);

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

      // Start vibration with infinite repeat
      Vibration.vibrate(pattern, true);

      // Animate through steps
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

        // Loop the elapsed time for infinite animation
        const loopedElapsed = elapsed % totalDuration;

        // Update progress
        const newProgress = loopedElapsed / totalDuration;
        setProgress(newProgress);

        // Calculate current step
        let timeSum = 0;
        for (let i = 0; i < pattern.length; i++) {
          timeSum += pattern[i];
          if (loopedElapsed <= timeSum) {
            if (currentStepIndex !== i) {
              setCurrentStep(i);
              currentStepIndex = i;

              // Pulse animation for vibration steps (even indices)
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

  const handleVibrate = (pattern: number[], id: string) => {
    // Stop if same pattern is clicked again
    if (activePatternId === id) {
      stopVibration();
      return;
    }

    // Stop any currently playing pattern
    if (activePatternId) {
      stopVibration();
    }

    // Start new infinite vibration
    startInfiniteVibration(pattern, id);
  };

  const renderStepIndicator = (pattern: number[], id: string) => {
    if (activePatternId !== id) return null;

    const totalDuration = pattern.reduce((acc, val) => acc + val, 0);
    const currentStepType =
      currentStep % 2 === 0 && pattern[currentStep] > 0 ? "Vibration" : "Pause";
    const currentStepDuration = pattern[currentStep] || 0;

    return (
      <View style={styles.stepContainer}>
        {/* Current Status */}
        <View style={styles.statusRow}>
          <Text style={styles.statusText}>
            Step {currentStep + 1}/{pattern.length} • {currentStepType} •{" "}
            {currentStepDuration}ms
          </Text>
          <View style={styles.loopBadge}>
            <Text style={styles.loopText}>∞ LOOP</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>

        {/* Step Dots */}
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />

      {/* Compact Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📳 Vibration Patterns</Text>
        <Text style={styles.headerSubtitle}>
          {activePatternId
            ? "Tap pattern to stop"
            : "Tap pattern to start infinite loop"}
        </Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {patterns.map((item) => {
          const isPlaying = activePatternId === item.id;
          const totalDuration = item.pattern.reduce((a, b) => a + b, 0);
          const frequency = getPatternFrequency(item.pattern);

          return (
            <View key={item.id} style={styles.cardWrapper}>
              <TouchableOpacity
                style={[styles.card, isPlaying && styles.cardActive]}
                onPress={() => handleVibrate(item.pattern, item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.cardContent}>
                  {/* Icon */}
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
                      <Text style={styles.iconText}>
                        {isPlaying ? "🔊" : "📳"}
                      </Text>
                    </Animated.View>
                  </View>

                  {/* Text Content */}
                  <View style={styles.textContainer}>
                    <Text style={styles.patternName}>{item.name}</Text>
                    <View style={styles.statsRow}>
                      <Text style={styles.patternStats}>
                        {item.pattern.length} steps • {totalDuration}ms •{" "}
                        {frequency}
                      </Text>
                    </View>
                    <Text style={styles.patternPreview} numberOfLines={1}>
                      {item.pattern
                        .map((dur, idx) => `${idx % 2 === 0 ? "V" : "P"}${dur}`)
                        .join(" ")}
                    </Text>
                  </View>

                  {/* Play Button */}
                  <View style={styles.playContainer}>
                    <View
                      style={[
                        styles.playButton,
                        isPlaying && styles.playButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.playIcon,
                          isPlaying && styles.playIconActive,
                        ]}
                      >
                        {isPlaying ? "⏹" : "▶"}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Step Indicator */}
                {renderStepIndicator(item.pattern, item.id)}
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  cardWrapper: {
    marginBottom: 12,
  },
  card: {
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
  cardActive: {
    borderColor: "#6366f1",
    shadowColor: "#6366f1",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
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
});
