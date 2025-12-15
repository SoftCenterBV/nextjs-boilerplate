'use server';

import { revalidatePath } from 'next/cache';
import * as Sentry from '@sentry/nextjs';

import { deleteAsJson, patchAsJson, postAsJson } from '../client';
import type { UserData } from '../types';
import {toast} from "sonner";

export type UserActionState = {
    success: boolean;
    message?: string;
    errors?: Record<string, string[]>;
    data?: UserData;
    code?: string;
};

export async function updateUserProfile(
    userId: string,
    data: Partial<UserData>
): Promise<UserData | null> {
    return Sentry.withServerActionInstrumentation(
        'userActions.updateUserProfile',
        { recordResponse: true },
        async () => {
            try {
                if (!userId) {
                    throw new Error('User ID is required to update profile.');
                }
                const updatedUser = await patchAsJson<UserData>(`/users/${userId}`, data); // Response is UserData

                // Revalidate relevant paths after successful update
                revalidatePath('/user/settings');
                revalidatePath('/', 'layout');

                return updatedUser;
            } catch (error: any) {
                return null;
            }
        }
    );
}

export async function deleteUser(): Promise<UserActionState> {
    return Sentry.withServerActionInstrumentation(
        'user.deleteUser',
        { recordResponse: true },
        async () => {
            try {
                await postAsJson(`/auth/delete`, {});

                revalidatePath('/', 'layout');

                return {
                    success: true,
                    message: 'deleteSuccess',
                };
            } catch (error: any) {
                // eslint-disable-next-line no-underscore-dangle
                const message = error?.response?._data?.message || 'deleteError';
                return {
                    success: false,
                    message,
                };
            }
        }
    );
}

export async function deleteUserFromEntity(
    id: string,
    type: 'organization' | 'product',
    userId: string
): Promise<{ success: boolean; message: string }> {
    return Sentry.withServerActionInstrumentation(
        'organization.deleteUserFromOrganization',
        { recordResponse: true },
        async () => {
            try {
                if (!id || !userId || (type !== 'organization' && type !== 'product')) {
                    return {
                        success: false,
                        message: 'ID, User ID, and Type are required to delete a user.',
                    };
                }

                if (type === 'product') {
                    await deleteAsJson(`/products/${id}/users/${userId}`, {});
                    revalidatePath('/profile/product');
                } else {
                    // type === 'organization'
                    await deleteAsJson(`/organizations/${id}/users/${userId}`, {});
                    revalidatePath('/profile/organization');
                }

                return {
                    success: true,
                    message: 'User deleted successfully from entity.',
                };
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : 'Failed to delete user from entity',
                };
            }
        }
    );
}
