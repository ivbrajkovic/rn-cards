import { Dimensions, StyleSheet, ViewStyle } from "react-native";
const { height: wHeight } = Dimensions.get("window");

const block = {
  position: "absolute",
  top: wHeight / 2 - 100,
  width: 50,
  height: 200,
};

export default StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "lightblue",
  },
  leftBlock: {
    ...block,
    left: 0,
    backgroundColor: "#ffff0070",
  } as ViewStyle,
  rightBlock: {
    ...block,
    right: 0,
    backgroundColor: "#ff000070",
  } as ViewStyle,
});
