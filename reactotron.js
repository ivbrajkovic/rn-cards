/* eslint-disable prefer-destructuring */
import Reactotron from "reactotron-react-native";

import Constants from "expo-constants";

const { manifest } = Constants;
const host = manifest.debuggerHost.split(":")[0];

const monkeyPatchConsoleLog = true;

Reactotron.configure({ host }) // controls connection & communication settings
  .configure()
  .useReactNative({ errors: true, editor: true }) // add all built-in react native plugins
  .connect(); // let's connect!

if (monkeyPatchConsoleLog) {
  // Patches console.log output.
  // https://gist.github.com/jperelli/d8728bf1916e07a79aed1bc129b52ec9
  const consoleLog = console.log;
  console.log = (...args) => {
    consoleLog(...args);
    Reactotron.log(args.length > 0 ? args : "");
  };
}

// Log async storage
Reactotron.onCustomCommand({
  command: "storage",
  handler: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const stores = await AsyncStorage.multiGet(keys);
      const obj = stores.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
      console.log(JSON.stringify(obj, null, 2));
    } catch (error) {
      console.log("[Error reading async storage]", error);
    }
  },

  // Optional settings
  title: "Async Storage", // This shows on the button
  description: "Show async storage", // This shows below the button
});

console.log("--=== Reactotron Loaded ===--");
