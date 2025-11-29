import {fetchAsJson} from './client';
import type {UserData} from './types';

export async function getCurrentUserProfile(): Promise<UserData | null> {
    try {
        return await fetchAsJson<UserData>('/users/me');
    } catch (error: any) {
        return null;
    }
}


