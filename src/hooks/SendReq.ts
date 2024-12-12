// src/hooks/SendReq.ts
import urls from '../config/urls';
import { getToken } from '../utils/authDB';

interface RequestOptions {
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    responseType?: 'json' | 'blob';
}

export const sendRequest = async ({ endpoint, method, body, responseType = 'json' }: RequestOptions): Promise<any> => {
    const token = getToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${urls.BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    if (responseType === 'blob') {
        return await response.blob();
    }

    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) : {};
};

export const sendRequestV2 = async ({ endpoint, method, body }: RequestOptions): Promise<any> => {
    const token = getToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('body', body);
    const response = await fetch(`${urls.ORIGINAL_BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        console.log('response', response);
        throw new Error(`Request failed with status ${response.status}`);
    }

    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) : {};
};

export const sendRequestV3 = async ({ endpoint, method, body }: RequestOptions): Promise<any> => {
    const token = getToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('body', body);
    const response = await fetch(`${urls.SLIDES_MICROSERVICE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        console.log('response', response);
        throw new Error(`Request failed with status ${response.status}`);
    }

    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) : {};
};

export const sendEncryptRequest = async ({ endpoint, method, body }: RequestOptions): Promise<any> => {
    const token = getToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${urls.SLIDES_MICROSERVICE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) : {};
};