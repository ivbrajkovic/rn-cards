import { Platform, StyleSheet } from "react-native";

interface IStyles {
  cardWidth: number;
  cardHeight: number;
}

export default ({ cardWidth, cardHeight }: IStyles) =>
  StyleSheet.create({
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
      width: cardWidth,
      height: cardHeight,
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
  });
