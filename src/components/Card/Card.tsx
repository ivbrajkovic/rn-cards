import React, { FC, useRef, useState } from "react";
import { Image, View } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { Grayscale } from "react-native-color-matrix-image-filters";

import { CardProps, ScreenSide } from "../../types";
import { snapPoint } from "../../utils";

import styles, { WINDOW_WIDTH, WINDOW_HEIGHT, CARD_WIDTH } from "./styles";

const SIDE = (WINDOW_WIDTH + CARD_WIDTH + 100) / 2;
const SNAP_POINTS = [-SIDE, 0, SIDE];
const DURATION = 250;
const LOWER_RENDER_LIMIT = 4;
const UPPER_RENDER_LIMIT = 1;

export const Card: FC<CardProps> = ({
  index,
  currentIndex,
  source,
  achieved,
  resetStack,
  onResetStack,
  onPopFromStack,
}) => {
  const thetaRef = useRef(-10 + Math.random() * 20);
  const initialRender = useSharedValue(achieved);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const rotateX = useSharedValue(30);
  const rotateZ = useSharedValue(achieved ? 0 : thetaRef.current);
  const translateX = useSharedValue(achieved ? 0 : SIDE);
  const translateY = useSharedValue(achieved ? -WINDOW_HEIGHT : 0);

  useAnimatedReaction(
    () => resetStack.value,
    () => {
      if (!resetStack.value) return;

      opacity.value = 0;
      if (!achieved) translateX.value = SIDE;
    },
  );

  useAnimatedReaction(
    () => currentIndex.value,
    () => {
      if (currentIndex.value !== index) return;

      opacity.value = withTiming(1, {
        duration: DURATION,
        easing: Easing.in(Easing.exp),
      });

      if (!initialRender.value) {
        translateX.value = withSpring(0);
        return;
      }

      initialRender.value = false;

      if (achieved) {
        translateY.value = withTiming(0, {
          duration: DURATION,
          easing: Easing.inOut(Easing.ease),
        });
        rotateZ.value = withTiming(thetaRef.current, {
          duration: DURATION,
          easing: Easing.inOut(Easing.ease),
        });
      }
    },
    [],
  );

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number; startY: number }
  >(
    {
      onStart: (_, ctx) => {
        ctx.startX = translateX.value;
        ctx.startY = translateY.value;
        scale.value = withTiming(1.1, { easing: Easing.inOut(Easing.ease) });
        rotateZ.value = withTiming(0, { easing: Easing.inOut(Easing.ease) });
        rotateX.value = withTiming(0, { easing: Easing.inOut(Easing.ease) });
      },
      onActive: (event, ctx) => {
        translateX.value = ctx.startX + event.translationX;
        translateY.value = ctx.startY + event.translationY;
      },
      onFinish: ({ velocityX, velocityY }) => {
        const dest = snapPoint(translateX.value, velocityX, SNAP_POINTS);

        if (dest) {
          onPopFromStack(dest < 0 ? ScreenSide.LEFT : ScreenSide.RIGHT);
          opacity.value = withTiming(0);
        }

        translateX.value = withSpring(dest, { velocity: velocityX });
        translateY.value = withSpring(0, { velocity: velocityY });
        rotateZ.value = withTiming(thetaRef.current);
        rotateX.value = withTiming(30);
        scale.value = withTiming(
          1,
          { easing: Easing.inOut(Easing.ease) },
          () => {
            !index && dest && onResetStack(true);
          },
        );
      },
    },
    [],
  );

  const rStyle = useAnimatedStyle(
    () => ({
      opacity: opacity.value,
      transform: [
        { perspective: 1000 },
        { rotateX: `${rotateX.value}deg` },
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotateY: `${rotateZ.value / 10}deg` },
        { rotateZ: `${rotateZ.value}deg` },
        { scale: scale.value },
      ],
    }),
    [],
  );

  const [isRender, setRender] = useState(index <= currentIndex.value);
  useAnimatedReaction(
    () => currentIndex.value,
    () => {
      const lowerLimit = currentIndex.value - LOWER_RENDER_LIMIT;
      const upperLimit = currentIndex.value + UPPER_RENDER_LIMIT;

      if (upperLimit < index || lowerLimit > index) runOnJS(setRender)(false);
      else runOnJS(setRender)(true);
    },
  );
  if (!isRender) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={[styles.card, rStyle]}>
          <Grayscale amount={achieved ? 0 : 1}>
            <Image
              source={{ uri: source, cache: "force-cache" }}
              blurRadius={achieved ? 0 : 20}
              style={styles.image}
            />
          </Grayscale>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};
