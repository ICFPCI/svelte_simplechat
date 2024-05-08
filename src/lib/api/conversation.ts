
import { API_URL } from '$env/static/private';
import type { Conversation } from '$lib/types';



const apiUrl: string = `${API_URL}/api/v1.0/chat/conversation/`

class ConversationService {
    async getAllConversations(authToken: string): Promise<Response> {
        // const response = await fetch(`${apiUrl}`, {
        //     headers: {
        //         Authorization: `Bearer ${authToken}`
        //     }
        // });
        return await fetch(`${apiUrl}`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });
    }

    async getConversationById(authToken: string, id: string): Promise<Conversation> {
        const response = await fetch(`${apiUrl}/${id}`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });

        const conversation = await response.json();
        return conversation;
    }

    async createConversation(newConversation: Conversation): Promise<Conversation> {
        // Lógica para crear una nueva conversación en la API
        const response = await fetch('/api/conversations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newConversation)
        });
        const createdConversation = await response.json();
        return createdConversation;
    }

    async updateConversation(id: string, updatedConversation: Conversation): Promise<Conversation> {
        // Lógica para actualizar una conversación en la API
        const response = await fetch(`/api/conversations/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedConversation)
        });
        const updated = await response.json();
        return updated;
    }

    async deleteConversation(id: string): Promise<void> {
        // Lógica para eliminar una conversación en la API
        await fetch(`/api/conversations/${id}`, {
            method: 'DELETE'
        });
    }
}

export default ConversationService;
