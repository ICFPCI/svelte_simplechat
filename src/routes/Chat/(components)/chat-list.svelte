<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { conversationStore } from '$lib/store.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { formatTimeAgo } from '$lib/utils.js';
	import type { Conversation } from '$lib/types.js';

	export let conversations: Conversation[];
	export let username: string | null;

	function getConversationName(conversation: Conversation): string | null {
		if (conversation.type === 'i' && conversation.users.length === 2) {
			return conversation.users.find((user) => user.username !== username)?.username || null;
		}
		return null;
	}
</script>

<ScrollArea class="h-screen">
	<div class="flex flex-col gap-2 p-4 pt-0">
		{#each conversations as conversation}
			<button
				class={cn(
					'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
					$conversationStore.selected === conversation.id && 'bg-muted'
				)}
				on:click={() => conversationStore.setInteraction(conversation.id)}
			>
				<div class="flex w-full flex-col gap-1">
					<div class="flex items-center">
						<div class="flex items-center gap-2">
							{#if conversation.type == 'i'}
								<div class="font-semibold">{getConversationName(conversation)}</div>
							{:else}
								<div class="font-semibold">{conversation.name}</div>
							{/if}
						</div>
						<div
							class={cn(
								'ml-auto text-xs',
								$conversationStore.selected === conversation.id
									? 'text-foreground'
									: 'text-muted-foreground'
							)}
						>
							{formatTimeAgo(
								new Date(conversation.messages[conversation.messages.length - 1].created)
							)}
						</div>
					</div>
				</div>
				<div class="word-break line-clamp-2 text-xs text-muted-foreground">
					{conversation.messages[conversation.messages.length - 1].text.substring(0, 100)}
				</div>
			</button>
		{:else}
			No items
		{/each}
	</div>
</ScrollArea>
