import { useState } from "react";
import { View, Dimensions, Text } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useSharedValue,
} from "react-native-reanimated";
import { Card } from "./Card/Card";

import styles from "./styles";

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

const MIDDLE_SCREEN = wWidth / 2;

enum ScreenSide {
  LEFT = -1,
  CENTER = 0,
  RIGHT = 1,
}

export const Tarot = () => {
  const shuffleBack = useSharedValue(false);
  const lastRemovedCard = useSharedValue(-1);

  const [text, setText] = useState("text");

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { screenSide: ScreenSide }
  >({
    onStart: ({ absoluteX }, ctx) => {
      ctx.screenSide =
        absoluteX > MIDDLE_SCREEN ? ScreenSide.RIGHT : ScreenSide.LEFT;
    },
    onEnd: ({ velocityX }, ctx) => {
      if (ctx.screenSide === ScreenSide.RIGHT && velocityX < 0) {
        console.log("onEnd", "swipe left");
        runOnJS(setText)("swipe left");
      } else if (ctx.screenSide === ScreenSide.LEFT && velocityX > 0) {
        console.log("onEnd", "swipe right");
        runOnJS(setText)("swipe right");
      }
    },
  });

  return (
    // <PanGestureHandler onGestureEvent={onGestureEvent}>
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          position: "absolute",
          top: 100,
          left: wWidth / 2 - 50,
        }}
      >
        {text}
      </Text>
      {cards.map((card, index) => (
        <Card
          key={index}
          index={index}
          card={card}
          shuffleBack={shuffleBack}
          lastRemovedCard={lastRemovedCard}
        />
      ))}
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={styles.leftBlock} />
      </PanGestureHandler>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={styles.rightBlock} />
      </PanGestureHandler>
    </View>
    // </PanGestureHandler>
  );
};
