import { MaterialIcons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { useDrawer } from "./DrawerContext";

type IconName = keyof typeof MaterialIcons.glyphMap;

type CustomHeaderProps = {
  title: string;
  leftIcon?: IconName;
  onLeftPress?: () => void;
  showBackButton?: boolean;
  hideLeftButton?: boolean;
  rightIcon?: IconName;
  onRightPress?: () => void;
  hideRightButton?: boolean;
  useCustomDrawer?: boolean;
};

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  leftIcon,
  onLeftPress,
  showBackButton = false,
  hideLeftButton = false,
  rightIcon,
  onRightPress,
  hideRightButton = true,
  useCustomDrawer = true,
}) => {
  const navigation = useNavigation();
  const { toggleDrawer } = useDrawer();

  const handleLeftPress = () => {
    if (onLeftPress) {
      onLeftPress();
      return;
    }
    if (showBackButton) {
      navigation?.canGoBack() && navigation.goBack();
    } else {
      if (useCustomDrawer) {
        toggleDrawer();
      } else {
        navigation?.dispatch(DrawerActions.openDrawer());
      }
    }
  };

  const getLeftIcon = (): IconName => {
    if (leftIcon) return leftIcon;
    return showBackButton ? "arrow-back" : "menu";
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: colors.primary }}
      edges={["top", "left", "right"]}
    >
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <View style={styles.container}>
        {!hideLeftButton ? (
          <TouchableOpacity
            onPress={handleLeftPress}
            style={styles.iconButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons
              name={getLeftIcon()}
              size={24}
              color={colors.white}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconSpacer} />
        )}

        {/* Title */}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {/* Right Button */}
        {!hideRightButton && rightIcon ? (
          <TouchableOpacity
            onPress={onRightPress}
            style={styles.iconButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name={rightIcon} size={24} color={colors.white} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconSpacer} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  iconSpacer: {
    width: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.white,
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
});

export default CustomHeader;
