import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";

const NotoSansFont = {
  normal: "Regular",
  bold: "Bold",
  "100": "Thin",
  "300": "Light",
  "400": "Regular",
  "500": "Medium",
  "700": "Bold",
  "900": "Black",
};

const disableStyles: StyleProp<TextStyle> = {
  fontStyle: undefined,
  fontWeight: undefined,
};

type TextProps = Text["props"];

export default function NotoSansText(props: TextProps) {
  const { fontWeight = "400" } = StyleSheet.flatten(props.style || {});
  const fontFamily = `NotoSansJP-${NotoSansFont[fontWeight]}`;
  return (
    <Text
      {...props}
      allowFontScaling={false}
      style={[props.style, { fontFamily }, disableStyles]}
    />
  );
}
