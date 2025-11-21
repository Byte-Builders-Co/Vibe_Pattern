import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface RadialMenuItem {
  id: string;
  icon: string;
  label?: string;
  onPress: () => void;
  color?: string;
}

interface RadialMenuProps {
  items: RadialMenuItem[];
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  radius?: number;
  centerIcon?: string;
  centerIconOpen?: string;
  centerColor?: string;
  itemColor?: string;
}

export default function RadialMenu({
  items,
  isOpen,
  onToggle,
  position = "bottom-right",
  radius = 120,
  centerIcon = "⚪",
  centerIconOpen = "✖",
  centerColor = "#4F46E5",
  itemColor = "#fff",
}: RadialMenuProps) {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const getContainerStyle = () => {
    const baseStyle = {
      position: "absolute" as const,
      width: radius * 2,
      height: radius * 2,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    };

    switch (position) {
      case "top-left":
        return { ...baseStyle, top: 50, left: 50 };
      case "top-right":
        return { ...baseStyle, top: 50, right: 50 };
      case "bottom-left":
        return { ...baseStyle, bottom: 50, left: 50 };
      case "bottom-right":
      default:
        return { ...baseStyle, bottom: 50, right: 50 };
    }
  };

  const handleItemPress = (item: RadialMenuItem) => {
    item.onPress();
    onToggle(false);
  };

  return (
    <View style={getContainerStyle()}>
      {items.map((item, index) => {
        const angle = (index * 360) / items.length;
        const rotate = angle + "deg";

        const translateX = animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, radius],
        });

        const scale = animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        });

        return (
          <Animated.View
            key={item.id}
            style={[
              styles.item,
              {
                transform: [
                  { rotate },
                  { translateX },
                  { rotate: "-" + angle + "deg" },
                ],
                opacity: animation,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => handleItemPress(item)}
              style={[
                styles.icon,
                { backgroundColor: item.color || itemColor },
              ]}
              accessibilityLabel={item.label || `Menu item ${index + 1}`}
            >
              <Text style={styles.iconText}>{item.icon}</Text>
            </TouchableOpacity>
            {item.label && (
              <View style={styles.labelContainer}>
                <Text style={styles.labelText}>{item.label}</Text>
              </View>
            )}
          </Animated.View>
        );
      })}

      {/* CENTER BUTTON */}
      <TouchableOpacity
        onPress={() => onToggle(!isOpen)}
        style={[styles.centerButton, { backgroundColor: centerColor }]}
        accessibilityLabel={isOpen ? "Close menu" : "Open menu"}
      >
        <Text style={styles.centerIcon}>
          {isOpen ? centerIconOpen : centerIcon}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    position: "absolute",
    alignItems: "center",
  },
  icon: {
    padding: 12,
    borderRadius: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconText: {
    fontSize: 20,
  },
  labelContainer: {
    position: "absolute",
    top: -30,
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  labelText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  centerIcon: {
    fontSize: 24,
    color: "#fff",
  },
});
