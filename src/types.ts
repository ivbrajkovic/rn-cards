import Animated from "react-native-reanimated";

export enum ScreenSide {
  LEFT = -1,
  CENTER = 0,
  RIGHT = 1,
}

export interface CardArrayItem {
  source: string;
  screenSide: ScreenSide | undefined;
}

export interface CardProps {
  index: number;
  achieved: boolean;
  currentIndex: Animated.SharedValue<number>;
  source: ReturnType<typeof require>;
  shuffleBack: Animated.SharedValue<boolean>;
  onResetStack: (shuffle?: boolean) => void;
  onPopFromStack: (screenSide: ScreenSide) => void;
}

export interface SwipeIndicatorProps {
  screenSide: Animated.SharedValue<ScreenSide | undefined>;
  onSwipe: () => void;
}
