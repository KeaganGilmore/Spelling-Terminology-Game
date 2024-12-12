import { getToken } from './authDB';

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL || '';

/**
 * Fetches audio stream from the server using the provided id.
 * @param id - The unique identifier for the audio file.
 * @returns The audio stream response.
 */
export async function fetchAudioStream(id: string): Promise<Response> {
  console.log(`[fetchAudioStream] Starting fetch process for audio ID: ${id}`);

  if (!id) {
    console.error('[fetchAudioStream] No ID provided');
    throw new Error('ID is required to fetch the audio stream.');
  }

  try {
    console.log('[fetchAudioStream] Fetching authorization token...');
    const token = await getToken();
    if (!token) {
      console.error('[fetchAudioStream] Failed to retrieve token.');
      throw new Error('Authorization token is missing.');
    }
    console.log('[fetchAudioStream] Authorization token retrieved successfully.');

    const url = `${REACT_APP_BASE_URL}/file/${id}/audio`;
    console.log(`[fetchAudioStream] Constructed URL: ${url}`);

    console.log('[fetchAudioStream] Initiating fetch request...');
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`[fetchAudioStream] Fetch failed with status: ${response.status}`);
      throw new Error(`Failed to fetch audio stream. Status code: ${response.status}`);
    }

    console.log('[fetchAudioStream] Audio stream fetched successfully.');
    return response;
  } catch (error) {
    console.error(`[fetchAudioStream] Error occurred: ${(error as Error).message}`);
    throw error;
  }
}
