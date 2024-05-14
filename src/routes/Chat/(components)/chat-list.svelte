<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { conversationStore } from '$lib/store.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { formatTimeAgo } from '$lib/utils.js';
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import ProfilePicture from "$lib/goku.jpeg"
	import type { Conversation } from '$lib/types.js';
	import * as Icons from '$lib/icons.js';
	import Input from '$lib/components/ui/input/input.svelte';

	export let conversations: Conversation[];
</script>

<div class="bg-background/95 p-4 z-10">
	<form>
		<div class="relative">
			<Icons.Search class="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
			<Input placeholder="Search" class="pl-8" />
		</div>
	</form>
</div>
<ScrollArea class="h-screen">
	<div class="flex flex-col gap-2 p-4 pt-0">
		{#each conversations as conversation}
			<button
				class={cn(
					'flex flex-row items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
					$conversationStore.selected === conversation.id && 'bg-muted'
				)}
				on:click={() => conversationStore.setInteraction(conversation.id)}
			>
				<Avatar.Root>
					<Avatar.Image src={ProfilePicture} alt="profile picture" />
					<Avatar.Fallback>CN</Avatar.Fallback>
				</Avatar.Root>
				<div class="flex w-full flex-col gap-1">
					<div class="flex items-center">
						<div class="flex items-center gap-2">
							{#if conversation.type == 'i'}
								<div class="font-semibold">{conversation.contact?.username}</div>
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
								{#if conversation.messages.length > 0}
									{formatTimeAgo(
										new Date(conversation.messages[conversation.messages.length - 1].created)
									)}
								{/if}
						</div>
					</div>
					<div class="word-break line-clamp-2 text-xs text-muted-foreground">
						{#if conversation.messages.length > 0}
							{conversation.messages[conversation.messages.length - 1].text.substring(0, 100)}
						{/if}
					</div>
				</div>
			</button>
		{:else}
			No items
		{/each}
	</div>
</ScrollArea>
