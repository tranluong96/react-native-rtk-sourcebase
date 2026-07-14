import "react-native-gesture-handler";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { store, persistor } from "./store";
import ApplicationNavigator from "./navigators/Application";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import "./translations";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { PortalProvider } from "@gorhom/portal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreen from "./screens/Splash/SplashScreen";
import { NetworkListener } from "./components";

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <BottomSheetModalProvider>
            <Provider store={store}>
              <NetworkListener />
              <PortalProvider>
                {/**
               * PersistGate delays the rendering of the app's UI until the persisted state has been retrieved
               * and saved to redux.
               * The `loading` prop can be `null` or any react instance to show during loading (e.g. a splash screen),
               * for example `loading={<SplashScreen />}`.
               * @see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
               */}
                <PersistGate loading={<SplashScreen />} persistor={persistor}>
                  <ApplicationNavigator />
                </PersistGate>
              </PortalProvider>
            </Provider>
          </BottomSheetModalProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
