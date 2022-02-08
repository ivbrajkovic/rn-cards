import { GestureHandlerRootView } from "react-native-gesture-handler";
import Achievements from "./src/components/Achievements";

if (__DEV__) {
  import("./reactotron");
  import("expo-dev-client");
}

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

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Achievements initialIndex={7} sources={sources} />
    </GestureHandlerRootView>
  );
}
