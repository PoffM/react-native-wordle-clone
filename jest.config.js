/** @type {import('@jest/types').Config.InitialOptions} */
const customConfig = {
  preset: "jest-expo",
  verbose: true,
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)",
  ],
  setupFilesAfterEnv: ["./jest.setup.js"]
};

module.exports = customConfig;
