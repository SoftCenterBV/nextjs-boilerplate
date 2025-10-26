import api, { setAuthToken } from '@/lib/api';

export async function logout() {
    await api.post('/logout');
    localStorage.removeItem('token');
    setAuthToken(null);
}