import { GestureHandlerRootView } from "react-native-gesture-handler";
import Achievements from "./src/components/Achievements";

if (__DEV__) {
  import("./reactotron");
  import("expo-dev-client");
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Achievements />
    </GestureHandlerRootView>
  );
}
