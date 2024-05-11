import { writable } from "svelte/store";
import type {Conversation} from "./types.js";

type ConversationStore = {
	selected: Conversation["id"] | null;
	isStartingConversation: boolean;
};

function createConversationStore() {
	const store = writable<ConversationStore>({ selected: null, isStartingConversation: false });

	return {
		subscribe: store.subscribe,
		setInteraction: (id: Conversation["id"] | null) => {
			store.update((store) => ({ ...store, selected: id, isStartingConversation:false }));
		},
		setStartingConversation: () => {
			store.update((store) => ({ ...store, isStartingConversation: true }));
		}
	};
}

export const conversationStore = createConversationStore();
