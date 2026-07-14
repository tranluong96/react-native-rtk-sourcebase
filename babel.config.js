/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.js', '.json'],
        alias: {
          '@': './src',
          types: './@types',
        },
      },
    ],
    'inline-dotenv',
    'react-native-worklets/plugin', // Reanimated 4 moved its babel plugin here; needs to be last
  ],
};
