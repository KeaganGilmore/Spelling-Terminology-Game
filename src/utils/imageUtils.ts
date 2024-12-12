import { getToken } from './authDB';

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL || '';

export async function fetchImageUrl(id: string): Promise<string> {
    console.log(`[fetchImageUrl] Starting fetch process for image ID: ${id}`);

    if (!id) {
        console.error('[fetchImageUrl] No ID provided');
        throw new Error('ID is required to fetch the image URL.');
    }

    try {
        console.log('[fetchImageUrl] Fetching authorization token...');
        const token = await getToken();
        if (!token) {
            console.error('[fetchImageUrl] Failed to retrieve token.');
            throw new Error('Authorization token is missing.');
        }
        console.log('[fetchImageUrl] Authorization token retrieved successfully.');

        const url = `${REACT_APP_BASE_URL}/file/${id}/image`;
        console.log(`[fetchImageUrl] Constructed URL: ${url}`);

        console.log('[fetchImageUrl] Initiating fetch request...');
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error(`[fetchImageUrl] Fetch failed with status: ${response.status}`);
            throw new Error(`Failed to fetch image URL. Status code: ${response.status}`);
        }

        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);

        console.log('[fetchImageUrl] Image URL created successfully.');
        return imageUrl;
    } catch (error) {
        console.error(`[fetchImageUrl] Error occurred: ${(error as Error).message}`);
        throw error;
    }
}