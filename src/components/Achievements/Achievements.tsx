import { FC, memo, useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { runOnJS, useSharedValue } from "react-native-reanimated";
import { AchievementsProps, ScreenSide } from "../../types";
import { delay, imagePrefetch } from "../../utils";
import Loader from "../Loader";

import Card from "./../Card";
import SwipeIndicator from "./../SwipeIndicator";
import styles from "./styles";

const DELAY = 300;

export const Achievements: FC<AchievementsProps> = memo(
  ({ initialIndex = 0, sources = [] }) => {
    const resetStack = useSharedValue(true);
    const currentIndex = useSharedValue<number>(-1);
    const screenSide = useSharedValue<ScreenSide | undefined>(ScreenSide.RIGHT);

    const initialRender = async () => {
      for (let index = 0; index <= initialIndex; index++) {
        currentIndex.value = index;
        await delay(DELAY);
      }
      resetStack.value = false;
    };

    useEffect(() => {
      initialRender();
    }, []);

    const initScreenSideArray = () => {
      "worklet";
      return sources.map((_, index) =>
        index <= initialIndex ? undefined : ScreenSide.RIGHT,
      );
    };

    const screenSideArray = useSharedValue<Array<ScreenSide | undefined>>(
      initScreenSideArray(),
    );

    const onResetStack = useCallback(() => {
      "worklet";
      resetStack.value = true;
      screenSide.value = ScreenSide.RIGHT;
      screenSideArray.value = initScreenSideArray();
      runOnJS(initialRender)();
    }, []);

    const onPopFromStack = useCallback((side: ScreenSide) => {
      "worklet";
      screenSideArray.value[currentIndex.value] = side;
      screenSide.value = side;
      currentIndex.value -= 1;
    }, []);

    const onPushOnStack = useCallback(() => {
      "worklet";
      currentIndex.value += 1;
      screenSide.value =
        currentIndex.value < screenSideArray.value.length - 1
          ? screenSideArray.value[currentIndex.value + 1]
          : undefined;
    }, []);

    const [loading, setLoading] = useState(true);
    useEffect(() => {
      (async () => {
        await imagePrefetch(sources.slice(0, initialIndex));
        setLoading(false);
      })();
    }, []);

    if (loading) return <Loader />;

    return (
      <View style={styles.container}>
        {sources.map((source, index) => (
          <Card
            key={index}
            index={index}
            currentIndex={currentIndex}
            source={source}
            achieved={index <= initialIndex}
            resetStack={resetStack}
            onResetStack={onResetStack}
            onPopFromStack={onPopFromStack}
          />
        ))}
        <SwipeIndicator screenSide={screenSide} onSwipe={onPushOnStack} />
      </View>
    );
  },
  (prev, next) => prev.initialIndex === next.initialIndex,
);
