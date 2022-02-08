import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { ScreenSide } from "../../types";
import { imagePrefetch } from "../../utils";

import Card from "./../Card";
import SwipeIndicator from "./../SwipeIndicator";
import styles from "./styles";

const sources = [
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

export const Achievements = ({ initialIndex = 3 }) => {
  const shuffleBack = useSharedValue(false);
  const currentIndex = useSharedValue<number>(initialIndex);
  const screenSide = useSharedValue<ScreenSide | undefined>(ScreenSide.RIGHT);

  const initScreenSideArray = () => {
    "worklet";
    return sources.map((_, index) =>
      index <= initialIndex ? undefined : ScreenSide.RIGHT,
    );
  };

  const screenSideArray = useSharedValue<Array<ScreenSide | undefined>>(
    initScreenSideArray(),
  );

  const onResetStack = useCallback((shuffle) => {
    "worklet";
    shuffleBack.value = shuffle;
    if (shuffle) {
      screenSide.value = ScreenSide.CENTER;
    } else {
      screenSide.value = ScreenSide.RIGHT;
      currentIndex.value = initialIndex;
      screenSideArray.value = initScreenSideArray();
    }
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

  if (loading)
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <View style={styles.container}>
      {sources.map((source, index) => (
        <Card
          key={index}
          index={index}
          currentIndex={currentIndex}
          source={source}
          achieved={index <= initialIndex}
          shuffleBack={shuffleBack}
          onResetStack={onResetStack}
          onPopFromStack={onPopFromStack}
        />
      ))}
      <SwipeIndicator screenSide={screenSide} onSwipe={onPushOnStack} />
    </View>
  );
};
