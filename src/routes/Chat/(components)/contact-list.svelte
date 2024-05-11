<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { conversationStore } from '$lib/store.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import ProfilePicture from "$lib/goku.jpeg"
	import type { User } from '$lib/types';
	import { createEventDispatcher } from 'svelte';
	import * as Icons from '$lib/icons.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';


	export let contacts: User[] = [];

	const dispatch = createEventDispatcher();

	function selectContact(contact: User) {
		dispatch('message', {
			type: "contactSelected",
			contact: contact
		});
	}

	function closeWindow() {
		dispatch('message', {
			type: "closeWindow"
		});
	}
</script>

<div class="bg-background w-full">
	<div class="flex items-center px-4 py-2">
		<Button variant="ghost" size="icon" on:click={()=> closeWindow()}>
			<Icons.ArrowLeft/>
		</Button>
		<h1 class="text-xl font-bold">Iniciar conversación</h1>
	</div>
	<Separator/>
	<div class="bg-background p-4 z-10">
		<form>
			<div class="relative">
				<Icons.Search class="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
				<Input placeholder="Buscar contacto" class="pl-8" />
			</div>
		</form>
	</div>
	<ScrollArea class="h-screen bg-background">
		<div class="flex flex-col gap-2 p-4 pt-0">
			{#each contacts as contact}
			<button
				class="flex flex-row items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent"
				on:click={()=> selectContact(contact)}
			>
					<Avatar.Root>
						<Avatar.Image src={ProfilePicture} alt="@shadcn" />
						<Avatar.Fallback>CN</Avatar.Fallback>
					</Avatar.Root>
					<div class="flex w-full flex-col gap-1">
						<div class="flex items-center">
							<div class="flex items-center gap-2">
								<div class="font-semibold">{contact.username}</div>
							</div>
						</div>
					</div>
				</button>
			{:else}
				No items
			{/each}
		</div>
	</ScrollArea>
</div>
