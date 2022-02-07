import React, { FC, useEffect, useRef } from "react";
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
  withDelay,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { Grayscale } from "react-native-color-matrix-image-filters";

import { ICard, ScreenSide } from "../../types";
import { snapPoint } from "../../utils";

import styles, { WINDOW_WIDTH, WINDOW_HEIGHT, CARD_WIDTH } from "./styles";

const SIDE = (WINDOW_WIDTH + CARD_WIDTH + 100) / 2;
const SNAP_POINTS = [-SIDE, 0, SIDE];
const DURATION = 250;
const SHUFFLE_DELAY = 150;

export const Card: FC<ICard> = ({
  index,
  source,
  achieved,
  shuffleBack,
  drawIndex,
  onShuffleBack,
  onPushCardOnStack,
}) => {
  const thetaRef = useRef(-10 + Math.random() * 20);

  const x = useSharedValue(achieved ? 0 : SIDE);
  const y = useSharedValue(achieved ? -WINDOW_HEIGHT : 0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const rotateZ = useSharedValue(0);
  const rotateX = useSharedValue(30);

  useEffect(() => {
    const delay = index * DURATION;

    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: DURATION,
        easing: Easing.in(Easing.exp),
      }),
    );

    if (achieved) {
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
    }

    // rotateZ.value = withDelay(delay, withTiming(thetaRef.current));
  }, []);

  useAnimatedReaction(
    () => drawIndex.value,
    (value) => {
      if (value !== index) return;

      x.value = withSpring(0);
      rotateZ.value = withTiming(thetaRef.current, {
        easing: Easing.in(Easing.exp),
      });
      drawIndex.value = undefined;
    },
    [],
  );

  useAnimatedReaction(
    () => shuffleBack.value,
    (value) => {
      if (!value) return;

      if (achieved) {
        const delay = SHUFFLE_DELAY * index;
        x.value = withDelay(delay, withSpring(0));
        rotateZ.value = withDelay(
          delay,
          withSpring(thetaRef.current, {}, () => {
            !index && onShuffleBack(false);
          }),
        );
      } else {
        x.value = SIDE;
        rotateZ.value = thetaRef.current;
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
        ctx.startX = x.value;
        ctx.startY = y.value;
        rotateZ.value = withTiming(0, { easing: Easing.inOut(Easing.ease) });
        scale.value = withTiming(1.1, { easing: Easing.inOut(Easing.ease) });
        rotateX.value = withTiming(0, { easing: Easing.inOut(Easing.ease) });
      },
      onActive: (event, ctx) => {
        x.value = ctx.startX + event.translationX;
        y.value = ctx.startY + event.translationY;
      },
      onFinish: ({ velocityX, velocityY }) => {
        const dest = snapPoint(x.value, velocityX, SNAP_POINTS);

        dest &&
          onPushCardOnStack({
            side: dest < 0 ? ScreenSide.LEFT : ScreenSide.RIGHT,
            index,
          });

        x.value = withSpring(dest, { velocity: velocityX });
        y.value = withSpring(0, { velocity: velocityY });
        rotateZ.value = withTiming(0);
        rotateX.value = withTiming(30);
        scale.value = withTiming(
          1,
          { easing: Easing.inOut(Easing.ease) },
          () => {
            !index && dest && onShuffleBack(true);
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
        { translateX: x.value },
        { translateY: y.value },
        { rotateY: `${rotateZ.value / 10}deg` },
        { rotateZ: `${rotateZ.value}deg` },
        { scale: scale.value },
      ],
    }),
    [],
  );

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
