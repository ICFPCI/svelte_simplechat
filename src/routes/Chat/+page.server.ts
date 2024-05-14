import type { Conversation, User } from "$lib/types";
import type { PageServerLoad } from "./$types";
import ConversationService from "$lib/api/conversation";
import UserService from "$lib/api/user";
import * as jose from 'jose';

const conversationService = new ConversationService();
const userService = new UserService();

export const load: PageServerLoad = async ({ cookies }) => {

	const layoutCookie = cookies.get("PaneForge:layout");
	const token = cookies.get("access_token") || "";

	let layout: number[] | undefined = undefined;

	layoutCookie && (layout = JSON.parse(layoutCookie));

	let conversations: Conversation[] = [];
	let contacts: User[] = [];
	let error: string | undefined = undefined;

	if (token != "") {
		try{
			const response = await conversationService.getAllConversations(token);
	
			if (!response.ok){
				throw new Error(response.statusText)
			}

			conversations = await response.json();

			const decodedJWT = jose.decodeJwt(token);
			const user_id = String(decodedJWT.user_id);

			conversations.forEach(conversation => {
				if(conversation.type === "i"){
					conversation.contact = conversation.users.find((user) => user.id !== Number(user_id)) || null;
				}
			})

		}catch(e){
			console.log("Conversations response error: ", error)
			error = String(e)		
		}

		try{
			const response = await userService.getAllUsers(token);

			if (!response.ok){
				throw new Error(response.statusText)
			}

			contacts = await response.json();

		}catch(e){
			console.log("Users response error: ", e)
			error = String(e)		
		}

	}

	return { layout, conversations, contacts, error };
};
