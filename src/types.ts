import Animated from "react-native-reanimated";

export enum ScreenSide {
  LEFT = -1,
  CENTER = 0,
  RIGHT = 1,
}

export interface AchievementsProps {
  initialIndex: number;
  sources: string[];
}

export interface CardProps {
  index: number;
  achieved: boolean;
  source: ReturnType<typeof require>;
  resetStack: Animated.SharedValue<boolean>;
  currentIndex: Animated.SharedValue<number>;
  onResetStack: (shuffle?: boolean) => void;
  onPopFromStack: (screenSide: ScreenSide) => void;
}

export interface SwipeIndicatorProps {
  screenSide: Animated.SharedValue<ScreenSide | undefined>;
  onSwipe: () => void;
}
