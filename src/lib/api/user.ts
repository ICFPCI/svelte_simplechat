
import { API_URL } from '$env/static/private';
import type { User } from '$lib/types';



const apiUrl: string = `${API_URL}/api/v1.0/user/profile`

class UserService {
    async getAllUsers(authToken: string): Promise<Response> {
        return await fetch(`${apiUrl}`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });
    }

    async getUserById(authToken: string, id: string): Promise<Response> {
        return await fetch(`${apiUrl}/${id}`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });
    }

    async createUser(newUser: User): Promise<Response> {
        return await fetch(`${apiUrl}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });
    }

    async updateUser(id: string, updatedUser: User): Promise<Response> {
        return await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        });
    }

    async deleteUser(id: string): Promise<Response> {
        return await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });
    }
}

export default UserService;
