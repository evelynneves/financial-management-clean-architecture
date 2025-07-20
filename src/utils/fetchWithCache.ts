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
