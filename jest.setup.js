import { Animated } from "react-native";

// Make all animations run instantly so tests don't have to wait for them:
const animationTiming = Animated.timing;
jest
  .spyOn(Animated, "timing")
  .mockImplementation((value, config) =>
    animationTiming(value, {
      ...config,
      duration: 0,
      delay: 0,
      useNativeDriver: false,
    })
  );
