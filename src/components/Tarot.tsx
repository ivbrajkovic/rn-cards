import { View, StyleSheet, Dimensions } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
} from "react-native-reanimated";
import { Card } from "./Card/Card";

const { width: wWidth } = Dimensions.get("window");

const cards = [
  {
    source: require("../../assets/death.png"),
  },
  {
    source: require("../../assets/chariot.png"),
  },
  {
    source: require("../../assets/high-priestess.png"),
  },
  {
    source: require("../../assets/justice.png"),
  },
  {
    source: require("../../assets/lover.png"),
  },
  {
    source: require("../../assets/pendu.png"),
  },
  {
    source: require("../../assets/tower.png"),
  },
  {
    source: require("../../assets/strength.png"),
  },
];

export const assets = cards.map((card) => card.source);

enum ScreenSide {
  LEFT = -1,
  CENTER = 0,
  RIGHT = 1,
}

export const Tarot = () => {
  const shuffleBack = useSharedValue(false);
  const lastRemovedCard = useSharedValue(-1);

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { screenSide: ScreenSide }
  >({
    onStart: ({ absoluteX }, ctx) => {
      if (absoluteX > wWidth / 2) {
        ctx.screenSide = ScreenSide.RIGHT;
      } else {
        ctx.screenSide = ScreenSide.LEFT;
      }
    },
    onEnd: ({ velocityX }, ctx) => {
      if (ctx.screenSide === ScreenSide.RIGHT && velocityX < 0) {
        console.log("onEnd", "swipe left");
      } else if (ctx.screenSide === ScreenSide.LEFT && velocityX > 0) {
        console.log("onEnd", "swipe right");
      }
    },
  });

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View style={styles.container}>
        {cards.map((card, index) => (
          <Card
            key={index}
            index={index}
            card={card}
            shuffleBack={shuffleBack}
            lastRemovedCard={lastRemovedCard}
          />
        ))}
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
  },
});
