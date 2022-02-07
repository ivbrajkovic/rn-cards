import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import { IStackItem, ScreenSide } from "../../types";
import { imagePrefetch } from "../../utils";

import Card from "./../Card";
import SwipeIndicator from "./../SwipeIndicator";
import styles from "./styles";

const sources: ReturnType<typeof require>[] = [
  "https://stspaceuat001.blob.core.windows.net/space/loyalty/avatars/Pixie%402x.png",
  "https://stspaceuat001.blob.core.windows.net/space/loyalty/avatars/Elf%402x.png",
  "https://stspaceuat001.blob.core.windows.net/space/loyalty/avatars/Wizzard%402x.png",
  "https://stspaceuat001.blob.core.windows.net/space/loyalty/avatars/Golem%402x.png",
  "https://stspaceuat001.blob.core.windows.net/space/loyalty/avatars/Valkyrie%402x.png",
  "https://stspaceuat001.blob.core.windows.net/space/loyalty/avatars/AirElemental%402x.png",
  "https://stspaceuat001.blob.core.windows.net/space/loyalty/avatars/Djinni%402x.png",
  "https://stspaceuat001.blob.core.windows.net/space/loyalty/avatars/Pegasus%402x.png",
  "https://stspaceuat001.blob.core.windows.net/space/loyalty/avatars/PureSpirit%402x.png",
  "https://stspaceuat001.blob.core.windows.net/space/loyalty/avatars/Exorcist%402x.png",
  "https://stspaceuat001.blob.core.windows.net/space/loyalty/avatars/Phoenix%402x.png",
  "https://stspaceuat001.blob.core.windows.net/space/loyalty/avatars/Archon%402x.png",
  "https://stspaceuat001.blob.core.windows.net/space/loyalty/avatars/GrandDefender%402x.png",
  "https://stspaceuat001.blob.core.windows.net/space/loyalty/avatars/StarAngel%402x.png",
  "https://stspaceuat001.blob.core.windows.net/space/loyalty/avatars/GreenDragon%402x.png",
  "https://stspaceuat001.blob.core.windows.net/space/loyalty/avatars/WhiteDragon%402x.png",
  "https://stspaceuat001.blob.core.windows.net/space/loyalty/avatars/JadeDragon%402x.png",
  "https://stspaceuat001.blob.core.windows.net/space/loyalty/avatars/SunDragon%402x.png",
  "https://stspaceuat001.blob.core.windows.net/space/loyalty/avatars/Swashbuckler%402x.png",
];

export const Achievements = ({ initialIndex = 7 }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      await imagePrefetch(sources.slice(0, initialIndex));
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
    })();
  }, []);

  const shuffleBack = useSharedValue(false);
  const screenSide = useSharedValue<ScreenSide | undefined>(undefined);
  const drawCardIndex = useSharedValue<number | undefined>(undefined);
  const removedCardsStack = useSharedValue<IStackItem[]>(
    sources
      .map((_, index) =>
        index >= initialIndex ? { index, side: ScreenSide.RIGHT } : undefined,
      )
      .filter((item) => !!item)
      .reverse() as IStackItem[],
  );

  useAnimatedReaction(
    () => removedCardsStack.value,
    (stack) => {
      screenSide.value = stack.length
        ? stack[stack.length - 1].side
        : undefined;
    },
    [],
  );

  const onShuffleBack = useCallback((shuffle) => {
    "worklet";
    shuffleBack.value = shuffle;
    if (shuffle) {
      screenSide.value = undefined;
    } else {
      removedCardsStack.value = [];
    }
  }, []);

  const onPushCardOnStack = useCallback((item: IStackItem) => {
    "worklet";
    removedCardsStack.value.push(item);
    screenSide.value = item.side;
  }, []);

  const onSwipe = useCallback(() => {
    "worklet";
    const stack = removedCardsStack.value;
    if (!stack.length) return;
    drawCardIndex.value = stack.pop()!.index;
    screenSide.value = stack[stack.length - 1]?.side;
  }, []);

  if (loading)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <View style={styles.container}>
      {sources.map((source, index) => (
        <Card
          key={index}
          index={index}
          source={source}
          achieved={index < initialIndex}
          shuffleBack={shuffleBack}
          drawIndex={drawCardIndex}
          onShuffleBack={onShuffleBack}
          onPushCardOnStack={onPushCardOnStack}
        />
      ))}
      <SwipeIndicator screenSide={screenSide} onSwipe={onSwipe} />
    </View>
  );
};
