import { writable } from "svelte/store";
import type {Conversation} from "./types.js";

type ConversationStore = {
	selected: Conversation["id"] | null;
};

function createConversationStore() {
	const store = writable<ConversationStore>({ selected: null });

	return {
		subscribe: store.subscribe,
		setInteraction: (id: Conversation["id"] | null) => {
			store.update((store) => ({ ...store, selected: id }));
		},
	};
}

export const conversationStore = createConversationStore();
