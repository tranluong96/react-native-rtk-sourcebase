import { Platform } from "react-native";

export const TYPE_CONSTANT = {
    DEVICE_TOKEN: "deviceToken",
    ACCEPT: "Accept",
    CANCEL: "Cancel",
    FIRST_ACCEPT_FACEID: "firstAcceptFaceId",
    SESSION: "session",
    ANDROID_CHANNEL_ID: "com.app.push.notification.id",
    ANDROID_CHANNEL_NAME: "com.app.push.notification.name",
}


//Update APP
export const iosStoreURL = "";
export const androidStoreURL = "";
export const appStore = "";
export const playStore = "";

// Transfer demo (see TransferScreen). Point these at your own endpoints; a
// large download is the easiest way to watch a cancel actually stop the bytes.
export const DEMO_UPLOAD_URL = "/upload";
export const DEMO_DOWNLOAD_URL = "/download";
export const DEMO_UPLOAD_FILE = {
    uri: "",
    name: "demo.jpg",
    type: "image/jpeg",
};

export const isIos = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';