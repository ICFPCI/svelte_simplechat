<script lang="ts">
	import ChatDisplay from './chat-display.svelte';
	import ChatList from './chat-list.svelte';
	import { conversationStore } from '$lib/store.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Icons from '$lib/icons.js';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import * as jose from 'jose';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import type { Conversation, Message } from '$lib/types.js';
	import Sun from 'svelte-radix/Sun.svelte';
	import Moon from 'svelte-radix/Moon.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toggleMode } from 'mode-watcher';
	import { onMount } from 'svelte';
	import { json } from '@sveltejs/kit';

	export let conversations: Conversation[];
	export let defaultLayout = [30, 70];

	let socket: WebSocket;
	let username: string | null;
	let loading: boolean = true;

	function onLayoutChange(sizes: number[]) {
		document.cookie = `PaneForge:layout=${JSON.stringify(sizes)}`;
	}

	async function getCookieValue(valueName: string) {
		let data;
		const cookies = document.cookie.split(';').map((cookie) => cookie.trim());
		for (let cookie of cookies) {
			const [name, value] = cookie.split('=');
			if (name.trim() === valueName) {
				data = value.trim();
				break;
			}
		}
		return data;
	}

	async function insertMessage(message: Message) {
		for (let i = 0; i < conversations.length; i++) {
			if (conversations[i].id == Number(message.conversation)) {
				console.log("Entre???")
				conversations[i].messages.push(message);
				conversations = conversations;
			}
		}
	}

	async function initWebsocket() {
		const token = await getCookieValue('access_token');
		socket = new WebSocket(`ws://127.0.0.1:8000/ws/?token=${token}`);

		socket.onopen = () => {
			console.log('Conexión establecida.');
		};

		socket.onmessage = (event) => {
			const event_data = JSON.parse(event.data);
			console.log('Mensaje recibido:', event_data);

			switch(event_data.type){
				case "new-message":
					const message: Message = event_data.data
					console.log('Mensaje: ', message);
					insertMessage(message);
					break;
				case "conversation-archived":
					if($conversationStore.selected === event_data.data.id){
						console.log("Se tiene que eliminar")
						conversationStore.setInteraction(null);
					}
					
					for (let i = 0; i < conversations.length; i++) {
						if (conversations[i].id === event_data.data.id) {
							console.log("se encontro")
							conversations.splice(i, 1);
							conversations = conversations
							break;
						}
					}
				}

		};

		socket.onerror = (error) => {
			console.error('Error en la conexión:', error);
		};

		socket.onclose = () => {
			console.log('Conexión cerrada.');
		};
	}

	onMount(async () => {
		const token = (await getCookieValue('access_token')) ?? '';
		const decodedJWT = jose.decodeJwt(token);
		username = String(decodedJWT.username);
		await initWebsocket();

		loading = false;
	});
</script>

{#if loading}
	<div class="flex h-screen items-center justify-center">
		<Icons.LoaderCircle class="mr-2 animate-spin" />
	</div>
{:else}
	<Resizable.PaneGroup
		direction="horizontal"
		{onLayoutChange}
		style="height: 100svh"
		class="flex items-stretch"
	>
		<Resizable.Pane defaultSize={defaultLayout[0]} minSize={25}>
			<div class="flex items-center px-4 py-2">
				<h1 class="text-xl font-bold">SimpleChat</h1>
				<div class="ml-auto flex items-center gap-2">
					<Tooltip.Root openDelay={0} group>
						<Tooltip.Trigger>
							<Button on:click={toggleMode} variant="ghost" size="icon">
								<Sun
									class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
								/>
								<Moon
									class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
								/>
								<span class="sr-only">Cambiar tema</span>
							</Button>
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>Cambiar tema</p>
						</Tooltip.Content>
					</Tooltip.Root>
					<Tooltip.Root openDelay={0} group>
						<Tooltip.Trigger>
							<Button variant="ghost" size="icon">
								<Icons.MessagesSquarePlus />
								<span class="sr-only">Iniciar conversación</span>
							</Button>
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>Nuevo Chat</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</div>
			</div>
			<Separator />

			<div class="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<form>
					<div class="relative">
						<Icons.Search class="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
						<Input placeholder="Search" class="pl-8" />
					</div>
				</form>
			</div>
			<ChatList {conversations} {username} />
		</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane defaultSize={defaultLayout[1]} minSize={50}>
			<ChatDisplay
				conversation={conversations?.find(
					(conversation) => conversation.id === $conversationStore.selected
				) || undefined}
				{socket}
				{username}
			/>
		</Resizable.Pane>
	</Resizable.PaneGroup>
{/if}
