/******************************************************************************
 *                                                                             *
 * Creation Date : 16/04/2025                                                  *
 *                                                                             *
 * Property : (c) This program, code or item is the Intellectual Property of   *
 * Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
 * the express written authorization of Evelyn. All rights reserved.           *
 *                                                                             *
 *******************************************************************************/

import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchWithCache = async <T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl = 60 * 5
): Promise<T> => {
    const cached = await AsyncStorage.getItem(key);
    const now = Date.now();

    if (cached) {
        try {
            const { timestamp, data } = JSON.parse(cached);
            if (now - timestamp < ttl * 1000) {
                return data as T;
            }
        } catch { }
    }

    const freshData = await fetchFn();
    await AsyncStorage.setItem(
        key,
        JSON.stringify({ data: freshData, timestamp: now })
    );
    return freshData;
};
