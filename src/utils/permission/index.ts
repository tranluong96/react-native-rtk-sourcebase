import { showAlert } from "@/components/Alert/Alert";
import i18n from "@/translations";
import { LocaleKeys } from "@/translations/locale_keys";
import { isIos } from "../configs/const";
import { check, openSettings, Permission, PERMISSIONS, request, RESULTS } from "react-native-permissions";

const platform = isIos ? "IOS" : "ANDROID";
const permissionPlatform = PERMISSIONS[platform];

export const openAppSettingSystem = openSettings;

export const perPhoto = isIos
    ? PERMISSIONS.IOS.PHOTO_LIBRARY // ios
    : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE; // android < 13

type Result = 'unavailable' | 'denied' | 'blocked' | 'granted' | 'limited';

export interface OptionCallBack {
    onUnAvailable?: Function;
    onDenied?: Function;
    onGranted?: Function;
    onBlocked?: Function;
}

function onBlock(content: string) {
    showAlert({
        title: i18n.t(LocaleKeys.common_notification),
        message: content,
        confirmationText: i18n.t(LocaleKeys.common_setting),
        dismissText: i18n.t(LocaleKeys.common_cancel),
        onCancel: () => { },
        onPress: () => openSettings(),
    });
}

function onCamBlock() {
    onBlock(LocaleKeys.message_warning_permission_camera_message);
}

export function onPhotoBlock() {
    onBlock(LocaleKeys.message_warning_message_alert_permission_photo_gallery);
}

const photoUtils = {
    requestCam: function () {
        const perType = permissionPlatform.CAMERA;
        return photoUtils.request(perType, {
            onBlocked: onCamBlock,
        });
    },
    requestPhoto: () => {
        return photoUtils.request(perPhoto, {
            onBlocked: onPhotoBlock,
        });
    },
    request: (perType: Permission, optionCallBack?: OptionCallBack) => {
        return new Promise(async (resolve, reject) => {
            requestPermission(perType, {
                ...optionCallBack,
                onGranted: () => {
                    optionCallBack?.onGranted?.();
                    resolve(RESULTS.GRANTED);
                },
                onBlocked: () => {
                    optionCallBack?.onBlocked?.();
                    resolve(RESULTS.DENIED);
                },
            });
        });
    },
};

export function checkPermission(permission: Permission, option: OptionCallBack) {
    const { onUnAvailable, onDenied, onGranted, onBlocked } = option;
    check(permission).then((result: Result) =>
        handleResult(result, {
            onUnAvailable,
            onDenied,
            onGranted,
            onBlocked,
        })
    );
}

export function requestPermission(permission: Permission, option: OptionCallBack) {
    const { onUnAvailable, onDenied, onGranted, onBlocked } = option;
    request(permission).then((result: Result) =>
        handleResult(result, {
            onUnAvailable,
            onDenied,
            onGranted,
            onBlocked,
        })
    );
}

function handleResult(result: Result, option: OptionCallBack) {
    const { onUnAvailable, onDenied, onGranted, onBlocked } = option;
    switch (result) {
        case RESULTS.UNAVAILABLE:
            /*
           This feature is not available (on this device / in this context)
           */
            onUnAvailable && onUnAvailable();
            break;
        case RESULTS.DENIED:
            /*
           The permission has not been requested / is denied but requestable
           */
            onDenied && onDenied();
            break;
        case RESULTS.GRANTED:
        case RESULTS.LIMITED:
            /*
          The permission is granted
           */
            onGranted && onGranted();
            break;
        case RESULTS.BLOCKED:
            /*
          The permission is denied and not requestable anymore
           */
            onBlocked && onBlocked();
            break;
    }
}
