
import { API_URL } from '$env/static/private';
import type { JWTToken } from '$lib/types';

const apiUrl: string = `${API_URL}/api/v1.0/auth`


export default class AuthService {
    async login(username: string, password: string): Promise<Response> {
        const response = await fetch(`${apiUrl}/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        });
        return response;
    }

    async verifyToken(token:string): Promise<Response>{
        const response = await fetch(`${apiUrl}/verify/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({token})
        });
        return response;
    }

    async refreshToken(refresh:string): Promise<Response>{
        const response = await fetch(`${apiUrl}/refresh/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({refresh})
        });
        return response;
    }
}
