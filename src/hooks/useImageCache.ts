import { useState, useEffect, useCallback, useMemo } from 'react';

interface ImageCacheEntry {
    blob: Blob;
    url: string;
}

export function useImageCache() {
    const [imageCache, setImageCache] = useState<Record<string, ImageCacheEntry>>({});

    // Fetch and cache an image
    const fetchAndCacheImage = useCallback(async (imageId: string, fetchFunction: (id: string) => Promise<Blob>) => {
        // If image is already in cache, return cached entry
        if (imageCache[imageId]) {
            return imageCache[imageId];
        }

        try {
            // Fetch the image blob
            const blob = await fetchFunction(imageId);

            // Create a blob URL
            const url = URL.createObjectURL(blob);

            // Update cache
            const newCacheEntry = { blob, url };
            setImageCache(prev => ({
                ...prev,
                [imageId]: newCacheEntry
            }));

            return newCacheEntry;
        } catch (error) {
            console.error(`Error caching image ${imageId}:`, error);
            throw error;
        }
    }, [imageCache]);

    // Bulk cache images
    const bulkCacheImages = useCallback(async (
        imageIds: string[],
        fetchFunction: (id: string) => Promise<Blob>
    ) => {
        const cachePromises = imageIds.map(id => fetchAndCacheImage(id, fetchFunction));
        return Promise.all(cachePromises);
    }, [fetchAndCacheImage]);

    // Get cached image
    const getCachedImage = useCallback((imageId: string) => {
        return imageCache[imageId];
    }, [imageCache]);

    // Cleanup blob URLs when component unmounts
    useEffect(() => {
        return () => {
            // Revoke all created object URLs to prevent memory leaks
            Object.values(imageCache).forEach(entry => {
                URL.revokeObjectURL(entry.url);
            });
        };
    }, [imageCache]);

    // Memoized return value to prevent unnecessary re-renders
    return useMemo(() => ({
        fetchAndCacheImage,
        bulkCacheImages,
        getCachedImage,
        imageCache
    }), [fetchAndCacheImage, bulkCacheImages, getCachedImage, imageCache]);
}