import React, { useCallback, useRef } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SW } = Dimensions.get("window");
const ITEM_SIZE = 70;
const ITEM_GAP = 12;

type PatternSelectorProps = {
  patterns: any[];
  selectedIndex: number;
  onSelectPattern: (index: number) => void;
};

export const PatternSelector: React.FC<PatternSelectorProps> = ({
  patterns,
  selectedIndex,
  onSelectPattern,
}) => {
  const scrollRef = useRef<ScrollView>(null);

  const handleSelect = useCallback(
    (i: number) => {
      onSelectPattern(i);
    },
    [onSelectPattern]
  );

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {patterns.map((it, i) => {
          const sel = selectedIndex === i;

          return (
            <TouchableOpacity
              key={it.id ?? i}
              style={[styles.item, sel && styles.itemSel]}
              onPress={() => handleSelect(i)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                {it.icon ? (
                  typeof it.icon === "string" && it.icon.startsWith("http") ? (
                    <Image
                      source={{ uri: it.icon }}
                      style={[
                        styles.itemIcon,
                        sel && styles.itemIconSel,
                        !sel && styles.itemIconDisabled,
                      ]}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text
                      style={[
                        styles.itemEmoji,
                        sel && styles.itemEmojiSel,
                        !sel && styles.itemEmojiDisabled,
                      ]}
                    >
                      {it.icon}
                    </Text>
                  )
                ) : (
                  <View></View>
                )}
              </View>

              <Text
                style={[styles.itemLbl, sel && styles.itemLblSel]}
                numberOfLines={1}
              >
                {it.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SW,
    paddingVertical: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    alignItems: "center",
  },
  item: {
    width: ITEM_SIZE,
    height: ITEM_SIZE + 28,
    borderRadius: 16,
    backgroundColor: "transparent",
    marginRight: ITEM_GAP,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  itemSel: {
    transform: [{ scale: 1.05 }],
  },

  iconContainer: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },

  itemIcon: {
    width: 40,
    height: 40,
  },
  itemIconSel: {
    tintColor: "red",
  },
  itemIconDisabled: {
    opacity: 0.4,
  },

  itemEmoji: {
    fontSize: 32,
  },
  itemEmojiSel: {
    color: "red",
  },
  itemEmojiDisabled: {
    opacity: 0.4,
  },

  itemLbl: {
    marginTop: 2,
    fontSize: 10,
    color: "#9ca3af",
    fontWeight: "600",
    textAlign: "center",
    opacity: 0.5,
  },
  itemLblSel: {
    color: "red",
    fontWeight: "700",
    opacity: 1,
  },
});
