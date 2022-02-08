import { FC } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface Props {
  loading?: boolean;
  size?: number | "large" | "small" | undefined;
}

const styles = StyleSheet.create({
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
});

const Loader: FC<Props> = ({ loading = true, size = "large" }) => (
  <View style={styles.loaderContainer}>
    <ActivityIndicator animating={loading} size={size} />
  </View>
);

export default Loader;
