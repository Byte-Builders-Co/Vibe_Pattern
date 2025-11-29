import { MaterialIcons } from "@expo/vector-icons";
import React, { FC, useEffect, useState } from "react";
import { Animated, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { useTheme } from "../context";
import { Text } from "./Text";

export type ToastTypes = "success" | "error" | "info" | "warning";

export interface ToastStateProp {
  show: boolean;
  type: ToastTypes;
  message: string;
}

type ToastVisualConfig = {
  icon: keyof typeof MaterialIcons.glyphMap;
  backgroundColor: string;
  borderColor: string;
  iconColor: string;
  textColor: string;
  iconBackgroundColor: string;
};

export const toastConfig: Record<ToastTypes, ToastVisualConfig> = {
  success: {
    icon: "check-circle",
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
    iconColor: "#16a34a",
    textColor: "#15803d",
    iconBackgroundColor: "#dcfce7",
  },
  info: {
    icon: "info",
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
    iconColor: "#2563eb",
    textColor: "#1e40af",
    iconBackgroundColor: "#dbeafe",
  },
  warning: {
    icon: "warning",
    backgroundColor: "#fffbeb",
    borderColor: "#fed7aa",
    iconColor: "#d97706",
    textColor: "#b45309",
    iconBackgroundColor: "#fef3c7",
  },
  error: {
    icon: "error",
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
    iconColor: "#dc2626",
    textColor: "#b91c1c",
    iconBackgroundColor: "#fee2e2",
  },
};

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
  type: ToastTypes;
  style?: ViewStyle;
  animationDuration?: number;
  slideDistance?: number;
  config?: typeof toastConfig;
}

export const Toast: FC<ToastProps> = ({
  message,
  type,
  duration = 4000,
  onClose,
  style,
  animationDuration = 300,
  slideDistance = 100,
  config = toastConfig,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-slideDistance));
  const { theme, isDark } = useTheme();

  const currentConfig = config[type];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -slideDistance * 3,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start(() => onClose());
    }, duration);

    return () => clearTimeout(timer);
  }, [
    fadeAnim,
    slideAnim,
    duration,
    onClose,
    animationDuration,
    slideDistance,
  ]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          borderColor: currentConfig.borderColor,
          backgroundColor: currentConfig.backgroundColor,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
        style,
      ]}
    >
      <View style={styles.row}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: currentConfig.iconBackgroundColor },
          ]}
        >
          <MaterialIcons
            name={currentConfig.icon}
            size={22}
            color={currentConfig.iconColor}
          />
        </View>

        <Text
          text={message}
          style={{
            color: currentConfig.textColor,
            width: "80%",
            marginLeft: 10,
          }}
          size="sm"
        />

        <Pressable onPress={onClose} style={{ marginRight: 10 }}>
          <MaterialIcons
            name="cancel"
            size={22}
            color={currentConfig.iconColor}
          />
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 75,
    justifyContent: "center",
    borderWidth: 1,
    paddingVertical: 8,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignSelf: "center",
    zIndex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
