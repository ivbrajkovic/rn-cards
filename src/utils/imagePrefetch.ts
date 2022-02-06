import { Image } from "react-native";

export const imagePrefetch = async (urls: string[]) => {
  try {
    if (await Image.queryCache?.(urls)) return true;

    const promises = urls.map((url) => Image.prefetch(url));
    const result = await Promise.all(promises);

    return !result.some((item) => !item);
  } catch (error) {
    return false;
  }
};
