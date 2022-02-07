import { FC } from "react";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { ISwipeIndicator, ScreenSide } from "../../types";

import styles, { INDICATOR_WIDTH, WINDOW_WIDTH } from "./styles";

export const SwipeIndicator: FC<ISwipeIndicator> = ({
  screenSide,
  onSwipe: onDrawCard,
}) => {
  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { screenSide: ScreenSide }
  >(
    {
      onEnd: ({ velocityX }) => {
        if (
          (screenSide.value === ScreenSide.LEFT && velocityX > 0) ||
          (screenSide.value === ScreenSide.RIGHT && velocityX < 0)
        )
          onDrawCard?.();
      },
    },
    [],
  );

  const rContainerStile = useAnimatedStyle(() => {
    const side = screenSide.value;
    const translateX =
      side === ScreenSide.LEFT
        ? 0
        : side === ScreenSide.RIGHT
        ? WINDOW_WIDTH - INDICATOR_WIDTH
        : -INDICATOR_WIDTH;
    return {
      transform: [{ translateX }],
    };
  }, []);

  const rArrowStyle = useAnimatedStyle(() => {
    if (!screenSide.value)
      return {
        opacity: 0,
        transform: [{ translateX: 0 }, { rotateZ: "0deg" }],
      };

    const opacity = withRepeat(
      withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: 600 }),
        withTiming(0, { duration: 400 }),
      ),
      3,
    );

    const fromValue = screenSide.value === ScreenSide.LEFT ? -20 : 20;
    const toValue = screenSide.value === ScreenSide.LEFT ? 100 : -100;
    const translateX = withRepeat(
      withSequence(
        withTiming(fromValue, { duration: 0 }),
        withTiming(toValue, { duration: 1000 }),
        withTiming(fromValue, { duration: 0 }),
      ),
      3,
    );

    const rotateZ = screenSide.value === ScreenSide.LEFT ? "-135deg" : "45deg";

    return { opacity, transform: [{ translateX }, { rotateZ }] };
  }, []);

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View
        style={[
          styles.container,
          rContainerStile,
          // { backgroundColor: "#ff000050" },
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[styles.arrow, rArrowStyle]}
        />
      </Animated.View>
    </PanGestureHandler>
  );
};
