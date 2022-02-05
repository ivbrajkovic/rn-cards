import Animated from "react-native-reanimated";

export enum ScreenSide {
  LEFT = -1,
  CENTER = 0,
  RIGHT = 1,
}

export interface QueueItem {
  side: ScreenSide;
  index: number;
}

export interface Queue {
  items: QueueItem[];
  hasItems: () => boolean;
  push: (item: QueueItem) => void;
  pop: () => QueueItem | undefined;
  peek: () => QueueItem | undefined;
}

export interface CardProps {
  index: number;
  card: {
    source: ReturnType<typeof require>;
  };
  shuffleBack: Animated.SharedValue<boolean>;
  putBackCardIndex: Animated.SharedValue<number | undefined>;
  removedCardsQueue: Animated.SharedValue<Queue>;
}
