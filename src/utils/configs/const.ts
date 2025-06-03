import { Platform } from "react-native";

export const TYPE_CONSTANT = {
    ACCEPT: "Accept",
    CANCEL: "Cancel",
    FIRST_ACCEPT_FACEID: "firstAcceptFaceId",
    SESSION: "session"
}


//Update APP
export const iosStoreURL = "";
export const androidStoreURL = "";
export const appStore = "";
export const playStore = "";

export const isIos = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';