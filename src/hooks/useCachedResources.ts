import { useEffect, useState } from "react";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function useCachedResources() {
    const [isLoadingComplete, setLoadingComplete] = useState(false);

    useEffect(() => {
        async function loadResourcesAndDataAsync() {
            try {
                await Asset.loadAsync([
                    require("../../assets/images/logo.png"),
                    require("../../assets/images/illustration_banner.png"),
                    require("../../assets/images/gift_icon.png"),
                    require("../../assets/images/withdraw_icon.png"),
                    require("../../assets/images/points_icon.png"),
                    require("../../assets/images/devices_icon.png"),
                ]);
            } catch (e) {
                console.warn("Erro ao carregar assets:", e);
            } finally {
                setLoadingComplete(true);
                await SplashScreen.hideAsync();
            }
        }

        loadResourcesAndDataAsync();
    }, []);

    return isLoadingComplete;
}
