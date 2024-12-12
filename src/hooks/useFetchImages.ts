import { useState, useEffect, useCallback, useRef } from 'react';
import { sendRequest } from './SendReq';
import { useImageCache } from './useImageCache';
import { ImageData } from '../models/models';
import { fetchImage } from './imageFetch';

interface FetchImagesProps {
    keyword: string;
    secondaryKeywords: string[];
}

export function useFetchImages({ keyword, secondaryKeywords }: FetchImagesProps) {
    const [images, setImages] = useState<ImageData[]>([]);
    const [imageURLs, setImageURLs] = useState<{ [key: string]: string }>({});
    const [status, setStatus] = useState<'idle' | 'loading' | 'completed'>('idle');
    const { fetchAndCacheImage } = useImageCache();
    const isInitialized = useRef(false);

    const processKeywords = useCallback((images: ImageData[]) => {
        const allKeywords = images.flatMap(img => img.keywords);
        const keywordCounts = allKeywords.reduce((acc, keyword) => {
            acc[keyword] = (acc[keyword] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return images.map(image => ({
            ...image,
            uniqueKeyword: image.keywords.find(keyword => keywordCounts[keyword] === 1)
        }));
    }, []);

    const fetchImages = useCallback(async () => {
        if (isInitialized.current || status !== 'idle') return;

        try {
            isInitialized.current = true;
            setStatus('loading');

            const response = await sendRequest({
                endpoint: `/images/${keyword}`,
                method: 'GET'
            });

            const filteredImages = response.filter((image: ImageData) =>
                secondaryKeywords.every(kw => image.keywords.includes(kw))
            );

            const processedImages = processKeywords(filteredImages);

            const imagesWithBlobs = await Promise.all(
                processedImages.map(async (image) => {
                    const cachedImage = await fetchAndCacheImage(image.image_id, fetchImage);
                    return { ...image, blob: cachedImage.blob };
                })
            );

            const urls: { [key: string]: string } = {};
            imagesWithBlobs.forEach(image => {
                if (image.blob) {
                    urls[image.image_id] = URL.createObjectURL(image.blob);
                }
            });

            setImages(imagesWithBlobs);
            setImageURLs(urls);
            setStatus('completed');
        } catch (error) {
            console.error('Error fetching images:', error);
            setStatus('completed');
        }
    }, [keyword, secondaryKeywords, fetchAndCacheImage, processKeywords, status]);

    useEffect(() => {
        fetchImages();

        return () => {
            Object.values(imageURLs).forEach(URL.revokeObjectURL);
            isInitialized.current = false;
        };
    }, [fetchImages]);

    return { images, imageURLs, status };
}