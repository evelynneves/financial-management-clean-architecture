/******************************************************************************
 *                                                                             *
 * Creation Date : 16/04/2025                                                  *
 *                                                                             *
 * Property : (c) This program, code or item is the Intellectual Property of   *
 * Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
 * the express written authorization of Evelyn. All rights reserved.           *
 *                                                                             *
 *******************************************************************************/

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
                    require("../../assets/images/illustration_login.png"),
                    require("../../assets/images/illustration_registration.png"),
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
