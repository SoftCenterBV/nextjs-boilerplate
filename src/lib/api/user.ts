import {fetchAsJson} from './client';
import type {UserData} from './types';

export async function getCurrentUserProfile(): Promise<UserData | null> {
    try {
        const currentUser = await fetchAsJson<{ data: UserData }>('/users/me');
        return  currentUser.data;
    } catch (error: any) {
        return null;
    }
}


