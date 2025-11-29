import React, { FC, ReactNode } from "react";
import {
  PixelRatio,
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
  TextStyle,
} from "react-native";
import { useTheme } from "../context";
import { fontSize, fontWeight, themedColors } from "../theme";

export interface TextProps {
  text?: string;
  children?: ReactNode;
  style?: TextStyle;
  size?: keyof typeof fontSize;
  weight?: keyof typeof fontWeight;
  color?: keyof typeof themedColors.light;
  textProps?: RNTextProps;
  maxScale?: number;
}

export const Text: FC<TextProps> = ({
  children,
  text,
  style,
  size = "xs",
  weight = "regular",
  color = "text",
  textProps,
  maxScale = 1.6,
}) => {
  const content = text || children;
  const { theme } = useTheme();

  const baseFontSize = fontSize[size]?.fontSize ?? 18;
  const systemScale = PixelRatio.getFontScale();
  const effectiveScale = Math.min(systemScale, maxScale);

  const modifiedStyle: TextStyle = {
    color: "",
    fontSize: baseFontSize * effectiveScale,
    fontWeight: fontWeight[weight]?.fontWeight,
    flexShrink: 1,
    ...style,
  };

  return (
    <RNText allowFontScaling={false} style={modifiedStyle} {...textProps}>
      {content}
    </RNText>
  );
};

const styles = StyleSheet.create({});
