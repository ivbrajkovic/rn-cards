import Animated from "react-native-reanimated";

export enum ScreenSide {
  LEFT = -1,
  CENTER = 0,
  RIGHT = 1,
}

export interface IStackItem {
  side: ScreenSide;
  index: number;
}

export interface ICard {
  index: number;
  achieved: boolean;
  source: ReturnType<typeof require>;
  shuffleBack: Animated.SharedValue<boolean>;
  drawIndex: Animated.SharedValue<number | undefined>;
  onShuffleBack: (shuffle?: boolean) => void;
  onPushCardOnStack: (item: IStackItem) => void;
}

export interface ISwipeIndicator {
  screenSide: Animated.SharedValue<ScreenSide | undefined>;
  onSwipe: () => void;
}
