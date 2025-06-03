import { CommonActions } from "@react-navigation/native";
import { ApplicationScreenProps } from "types/navigation";

export const navigate = (navigation: ApplicationScreenProps, name: string, params?: object) => {
    if (navigation) {
        if (params) {
            navigation.navigate(name, params);
        } else {
            navigation.navigate(name);
        }
    }
};

export const navigateAndReset = (navigation: ApplicationScreenProps, routes = [], index: number = 0) => {
    if (navigation) {
        navigation.dispatch(
            CommonActions.reset({
                index,
                routes,
            }),
        )
    }
}

export const navigateAndSimpleReset = (navigation: ApplicationScreenProps, name: string, index = 0) => {
    if (navigation) {
        navigation.dispatch(
            CommonActions.reset({
                index,
                routes: [{ name }],
            }),
        )
    }
}
