import type { Conversation } from "$lib/types";
import type { PageServerLoad } from "./$types";
import ConversationService from "$lib/api/conversation";

const conversationService = new ConversationService();

export const load: PageServerLoad = async ({ cookies }) => {

	const layoutCookie = cookies.get("PaneForge:layout");
	const token = cookies.get("access_token") || "";

	let layout: number[] | undefined = undefined;

	layoutCookie && (layout = JSON.parse(layoutCookie));

	let conversations: Conversation[] = [];
	let error: string | undefined = undefined;

	if (token != "") {
		const response = await conversationService.getAllConversations(token);

		if (response.ok) {
			conversations = await response.json();
		} else {
			error = response.statusText;
		}

	}

	return { layout, conversations, error };
};
