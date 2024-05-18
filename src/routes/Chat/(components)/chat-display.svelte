<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import { DateFormatter, getLocalTimeZone, now } from '@internationalized/date';
	import InTextBubble from './(chat-bubble)/in/in-text-bubble.svelte';
	import OutTextBubble from './(chat-bubble)/out/out-text-bubble.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { afterUpdate, onMount, beforeUpdate } from 'svelte';
	import { toast } from 'svelte-sonner';

	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Icons from '$lib/icons.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import type { Conversation, User } from '$lib/types.js';
	import { conversationStore } from '$lib/store';

	export let conversation: Conversation | undefined;
	export let socket: WebSocket;
	export let username: string | null;
	export let contact: User | undefined;

	let todayDate = now(getLocalTimeZone());
	let container: HTMLElement;
	let messageText: string = '';

	const relativeFormatter = new DateFormatter('en-US', {
		weekday: 'short',
		hour: '2-digit',
		minute: '2-digit',
		hourCycle: 'h12'
	});

	$: contact = !$conversationStore.isStartingConversation ? conversation?.contact : contact;

	afterUpdate(() => {
		if (container) {
			const { scrollHeight } = container;
			container.scrollTo({ top: scrollHeight, behavior: 'instant' });
		}
	});

	function sendMessage() {
		if (messageText === '') {
			toast.error('Campo de texto vacio. Asegúrate de ingresar el texto a ser enviado.');
			return;
		}

		if (conversation == undefined) {
			return;
		}

		if (socket && socket.readyState === WebSocket.OPEN) {
			const wsMessage = JSON.stringify({
				type: 'send-message',
				message: {
					text: messageText,
					conversation_id: conversation?.id.toString()
				}
			});

			socket.send(wsMessage);
		} else {
			console.error('La conexion websocket no esta abierta');
		}
		messageText = '';
	}

	function archiveConversation(){
		if (conversation == undefined){
			toast.error('No se ha seleccionado una conversacion para archivar');
			return;
		}

		if (socket && socket.readyState === WebSocket.OPEN) {
			const wsMessage = JSON.stringify({
				type: 'archive-conversation',
				message: {
					conversation_id: conversation?.id.toString()
				}
			});

			socket.send(wsMessage);
		} else {
			console.error('La conexion websocket no esta abierta');
		}
	}
</script>

{#if $conversationStore.selected || $conversationStore.isStartingConversation}
	<div class="flex h-full flex-col">
		<div class="flex items-center p-2">
			<div class="flex items-center gap-2">
				<Tooltip.Root openDelay={0} group>
					<Tooltip.Trigger
						id="fijar_conversacion"
						class={buttonVariants({ variant: 'ghost', size: 'icon' })}
						disabled={!conversation}
					>
						<Icons.Pin class="size-4" />
						<span class="sr-only">Fijar conversación</span>
					</Tooltip.Trigger>
					<Tooltip.Content>Fijar conversación</Tooltip.Content>
				</Tooltip.Root>
				<Tooltip.Root openDelay={0} group>
					<Tooltip.Trigger
						id="archivar_conversacion"
						class={buttonVariants({ variant: 'ghost', size: 'icon' })}
						disabled={!conversation}
					>
						<Button variant="ghost" size="icon" on:click={archiveConversation}>
							<Icons.Archive class="size-4" />
							<span class="sr-only">Archivar conversación</span>
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>Archivar conversación</Tooltip.Content>
				</Tooltip.Root>
				<Separator orientation="vertical" class="mx-1 h-6" />
				<Tooltip.Root openDelay={0} group>
					<Popover.Root portal={null}>
						<Tooltip.Trigger asChild let:builder={tooltip_builder} id="snooze_popover">
							<Popover.Trigger asChild let:builder={popover_builder} id="snooze_popover">
								<Button
									builders={[tooltip_builder, popover_builder]}
									variant="ghost"
									size="icon"
									disabled={!conversation}
								>
									<Icons.VolumeX class="size-4" />
									<span class="sr-only"></span>
								</Button>
							</Popover.Trigger>
						</Tooltip.Trigger>
						<Popover.Content class="flex w-[535px] p-0">
							<div class="flex flex-col gap-2 border-r px-2 py-4">
								<div class="px-4 text-sm font-medium">Silenciar</div>
								<div class="grid min-w-[250px] gap-1">
									<Button variant="ghost" class="justify-start font-normal">
										Una Hora
										<span class="ml-auto text-muted-foreground">
											{relativeFormatter.format(todayDate.add({ hours: 1 }).toDate())}
										</span>
									</Button>
									<Button variant="ghost" class="justify-start font-normal">
										Dos Horas
										<span class="ml-auto text-muted-foreground">
											{relativeFormatter.format(todayDate.add({ hours: 2 }).toDate())}
										</span>
									</Button>
									<Button variant="ghost" class="justify-start font-normal">
										Tres Horas
										<span class="ml-auto text-muted-foreground">
											{relativeFormatter.format(todayDate.add({ hours: 3 }).toDate())}
										</span>
									</Button>
									<Button variant="ghost" class="justify-center bg-gray-50 font-normal">
										Esperar a la respuesta del cliente
									</Button>
								</div>
							</div>
							<div class="p-2">
								<Calendar bind:value={todayDate} initialFocus />
							</div>
						</Popover.Content>
					</Popover.Root>
					<Tooltip.Content>Silenciar conversación</Tooltip.Content>
				</Tooltip.Root>
			</div>
			<div class="ml-auto flex items-center gap-2" />
			<Separator orientation="vertical" class="mx-2 h-6" />
			<DropdownMenu.Root>
				<DropdownMenu.Trigger
					id="more_options_dropdown"
					class={buttonVariants({ variant: 'ghost', size: 'icon' })}
					disabled={!conversation}
				>
					<Icons.EllipsisVertical class="size-4" />
					<span class="sr-only">More</span>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Item>Pin</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
		<Separator />
		<div class="flex h-full flex-1 flex-col overflow-hidden">
			<div class="flex items-start p-4">
				<div class="flex items-start gap-4 text-sm">
					<Avatar.Root>
						<Avatar.Image alt={contact?.username.toUpperCase()} />
						<Avatar.Fallback>
							{contact?.username
								.toUpperCase()
								.split(' ')
								.map((chunk) => chunk[0])
								.join('')}
						</Avatar.Fallback>
					</Avatar.Root>
					<div class="grid gap-1">
						<div class="font-semibold">{contact?.username}</div>

						<div class="line-clamp-1 text-xs">
							<span class="font-medium">Usuario:</span>
							{contact?.username}
						</div>
					</div>
				</div>
			</div>
			<Separator />
			{#if conversation}
				<div
					bind:this={container}
					class="flex-1 overflow-y-auto whitespace-pre-wrap p-4 px-4 text-sm"
				>
					{#each conversation?.messages as message}
						{#if message.user.username == username}
							<OutTextBubble
								username={message.user.username}
								created={message.created}
								text={message.text}
								status={'Entregado'}
							/>
						{:else}
							<InTextBubble
								username={message.user.username}
								created={message.created}
								text={message.text}
							/>
						{/if}
					{:else}
						No items
					{/each}
				</div>
			{/if}
			<Separator class="mt-auto" />
			<div class="p-2">
				<form on:submit|preventDefault={sendMessage}>
					<div class="flex items-center gap-4">
						<Textarea
							bind:value={messageText}
							class="p-4"
							placeholder={`${$conversationStore.isStartingConversation ? "Comenzar conversación con" : "Responder a"} ${contact?.username}...`}
						/>
						<Button type="submit" size="icon" variant="ghost" class="ml-auto">
							<Icons.SendHorizontal class="size-6" />
						</Button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}
