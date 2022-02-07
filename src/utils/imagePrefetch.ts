import { Image } from "react-native";

export const imagePrefetch = async (urls: string[]) => {
  try {
    const cache = (await Image.queryCache?.(urls)) || {};

    const promises = urls
      .filter((url) => !cache[url])
      .map((url) => Image.prefetch(url));

    await Promise.all(promises);

    return true;
  } catch (error) {
    return false;
  }
};
