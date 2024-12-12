// src/hooks/imageFetch.ts
import { sendRequest } from './SendReq';

export const fetchImage = async (imageId: string): Promise<Blob> => {
    const endpoint = `/file/${imageId}/image`;
    const response = await sendRequest({ endpoint, method: 'GET', responseType: 'blob' });

    if (!response) {
        throw new Error(`Failed to fetch image with ID ${imageId}`);
    }

    return response;
};