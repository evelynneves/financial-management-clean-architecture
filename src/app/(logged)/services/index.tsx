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
