import { useState, useEffect } from 'react';

/**
 * A hook to safely access Zustand stores with persistence/hydration.
 * Prevents hydration mismatch errors in Next.js by waiting for the component to mount.
 * 
 * @param store The Zustand store hook
 * @param callback Selection callback for the store
 */
export const useStore = <T, F>(
    store: (callback: (state: T) => unknown) => unknown,
    callback: (state: T) => F
) => {
    const result = store(callback) as F;
    const [data, setData] = useState<F>();

    useEffect(() => {
        setData(result);
    }, [result]);

    return data;
};
