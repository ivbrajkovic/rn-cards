import { Dimensions, StyleSheet } from "react-native";
const { height: wHeight, width: wWidth } = Dimensions.get("window");

export const INDICATOR_WIDTH = 50;
export const INDICATOR_HEIGHT = wHeight * 0.8;
export const WINDOW_WIDTH = wWidth;

export default StyleSheet.create({
  container: {
    position: "absolute",
    top: wHeight / 2 - INDICATOR_HEIGHT / 2,
    width: INDICATOR_WIDTH,
    height: INDICATOR_HEIGHT,
    // backgroundColor: "#ff000070",
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: {
    position: "absolute",
    width: 50,
    height: 50,
    borderWidth: 10,
    borderLeftColor: "white",
    borderBottomColor: "white",
    borderTopColor: "transparent",
    borderRightColor: "transparent",
  },
});
