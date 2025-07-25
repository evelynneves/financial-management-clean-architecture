/******************************************************************************
 *                                                                             *
 * Creation Date : 16/04/2025                                                  *
 *                                                                             *
 * Property : (c) This program, code or item is the Intellectual Property of   *
 * Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
 * the express written authorization of Evelyn. All rights reserved.           *
 *                                                                             *
 *******************************************************************************/

import { useFocusEffect } from "expo-router";
import { preloadServicesAssets } from "@/utils/preloadAssets";
import { useCallback } from "react";

import ServicesScreen from "@/presentation/screens/logged/services/ServicesScreen";

export default function ServicesPage() {
    useFocusEffect(
        useCallback(() => {
            preloadServicesAssets();
        }, [])
    );

    return <ServicesScreen />;
}
