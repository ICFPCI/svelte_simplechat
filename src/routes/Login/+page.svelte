<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Icons from '$lib/icons.js';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';


	let submited: boolean = false;

	// export let form;
	// $:{
	// 	if (submited && form != null){
	// 		submited = false
	// 		if (form?.success){
	// 			const username = String(form?.username)
	// 			const userID = String(form?.userID)
	// 			if (username && userID) {
	// 				localStorage.setItem("username", username)
	// 				localStorage.setItem("user_id", userID)
	// 				goto('/Chat');
	// 			}
	// 		}else{
	// 			toast.info('error');
	// 		}
	// 	}
	// }

</script>

<div class="flex h-svh w-svw items-center justify-center">
	<form method="POST" use:enhance on:submit={()=>{submited=true}}>
		<Card.Root class="h-fit w-full max-w-sm">
			<Card.Header>
				<Card.Title class="text-2xl">Iniciar sesión</Card.Title>
				<Card.Description>Introduzca su usuario para acceder a su cuenta.</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="grid gap-4">
					<div class="grid gap-2">
						<Label for="username">Usuario</Label>
						<Input id="username" name="username" type="text" required />
					</div>
					<div class="grid gap-2">
						<Label for="password">Contraseña</Label>
						<Input id="password" name="password" type="password" required />
					</div>
					<Button type="submit" class="w-full" disabled={submited}>
						{#if submited}
							<Icons.LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
						{/if}
						Iniciar sesión
					</Button>
				</div>
				<div class="mt-4 text-center text-sm">
					Todavía no tienes una cuenta?
					<a href="Register" class="underline"> Registrarse </a>
				</div>
			</Card.Content>
		</Card.Root>
	</form>
</div>
