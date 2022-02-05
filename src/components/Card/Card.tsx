import React, { FC, useEffect, useRef } from "react";
import { Dimensions, Image, View } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { CardProps, ScreenSide } from "../../types";
import { snapPoint } from "../../utils";

import stylesFactory from "./styles";

const { width: wWidth, height: wHeight } = Dimensions.get("window");

const IMAGE_ASPECT_RATIO = 722 / 368;
const CARD_WIDTH = wWidth - 128;
const CARD_HEIGHT = CARD_WIDTH * IMAGE_ASPECT_RATIO;
const IMAGE_WIDTH = CARD_WIDTH * 0.9;
const SIDE = (wWidth + CARD_WIDTH + 100) / 2;
const SNAP_POINTS = [-SIDE, 0, SIDE];
const DURATION = 250;

const styles = stylesFactory({
  cardHeight: CARD_HEIGHT,
  cardWidth: CARD_WIDTH,
});

export const Card: FC<CardProps> = ({
  index,
  card: { source },
  shuffleBack,
  putBackCardIndex,
  removedCardsQueue,
}) => {
  const thetaRef = useRef(-10 + Math.random() * 20);

  const x = useSharedValue(0);
  const y = useSharedValue(-wHeight);
  const scale = useSharedValue(1);
  const rotateZ = useSharedValue(0);

  useEffect(() => {
    const delay = index * DURATION;
    y.value = withDelay(
      delay,
      withTiming(0, {
        duration: DURATION,
        easing: Easing.inOut(Easing.ease),
      }),
    );
    rotateZ.value = withDelay(
      delay,
      withTiming(thetaRef.current, {
        duration: DURATION,
        easing: Easing.inOut(Easing.ease),
      }),
    );
    // rotateZ.value = withDelay(delay, withTiming(thetaRef.current));
  }, []);

  useAnimatedReaction(
    () => putBackCardIndex.value,
    (value) => {
      if (!value || value !== index) return;
      x.value = withSpring(0);
      putBackCardIndex.value = -1;
    },
  );

  useAnimatedReaction(
    () => shuffleBack.value,
    (value) => {
      if (!value) return;
      const delay = 150 * index;
      x.value = withDelay(delay, withSpring(0));
      rotateZ.value = withDelay(
        delay,
        withSpring(thetaRef.current, {}, () => {
          shuffleBack.value = false;
        }),
      );
    },
  );

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number; startY: number }
  >({
    onStart: (_, ctx) => {
      ctx.startX = x.value;
      ctx.startY = y.value;
      rotateZ.value = withTiming(0, { easing: Easing.inOut(Easing.ease) });
      scale.value = withTiming(1.1, { easing: Easing.inOut(Easing.ease) });
    },
    onActive: (event, ctx) => {
      x.value = ctx.startX + event.translationX;
      y.value = ctx.startY + event.translationY;
    },
    onFinish: ({ velocityX, velocityY }) => {
      const dest = snapPoint(x.value, velocityX, SNAP_POINTS);
      if (dest !== 0) {
        removedCardsQueue.value.push({
          side: dest < 0 ? ScreenSide.LEFT : ScreenSide.RIGHT,
          index,
        });
      }

      x.value = withSpring(dest, { velocity: velocityX });
      y.value = withSpring(0, { velocity: velocityY });
      rotateZ.value = withTiming(0);
      scale.value = withTiming(1, { easing: Easing.inOut(Easing.ease) }, () => {
        if (index === 0 && dest) {
          shuffleBack.value = true;
        }
      });
    },
  });

  const style = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateX: "30deg" },
      { translateX: x.value },
      { translateY: y.value },
      { rotateY: `${rotateZ.value / 10}deg` },
      { rotateZ: `${rotateZ.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <View style={styles.container} pointerEvents="box-none">
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={[styles.card, style]}>
          <Image
            source={source}
            style={{
              width: IMAGE_WIDTH,
              height: IMAGE_WIDTH * IMAGE_ASPECT_RATIO,
            }}
          />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};
