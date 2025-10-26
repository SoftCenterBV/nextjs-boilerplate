import api, { setAuthToken } from '@/lib/api';

export async function login(email: any, password: any) {
    const response = await api.post('/auth/login', { email, password });

    const token = response.data.token;

    // Token opslaan (bijv. in localStorage)
    localStorage.setItem('token', token);

    // Token toevoegen aan axios headers
    setAuthToken(token);

    return response.data.user;
}
