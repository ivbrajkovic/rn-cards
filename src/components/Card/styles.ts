import { Dimensions, Platform, StyleSheet } from "react-native";

const { width: wWidth, height: wHeight } = Dimensions.get("window");

export const IMAGE_ASPECT_RATIO = 0.7362204724409449;

export const WINDOW_WIDTH = wWidth;
export const WINDOW_HEIGHT = wHeight;

export const CARD_WIDTH = WINDOW_WIDTH * 0.75;
export const IMAGE_WIDTH = CARD_WIDTH * 0.9;

export default StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    ...Platform.select({
      android: {
        borderColor: "black",
        borderWidth: 1,
      },
    }),
    backgroundColor: "white",
    borderRadius: 10,
    width: CARD_WIDTH,
    aspectRatio: IMAGE_ASPECT_RATIO,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // elevation: 5,
  },
  image: {
    width: IMAGE_WIDTH,
    aspectRatio: IMAGE_ASPECT_RATIO,
  },
});
