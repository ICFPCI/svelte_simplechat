<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { enhance } from '$app/forms';

	let submited: boolean = false;

	function verifyPassword(){
		
		const password1 = (document.getElementById("password") as HTMLInputElement).value;
		const password2 = (document.getElementById('repeatpassword') as HTMLInputElement).value;


		if (password1 === ""){
			return
		}

		if (password2 === ""){
			return
		}

		if (password1 == password2){
			alert("hola")
			return
		}

		return;
	}
	
</script>

<div class="flex h-svh w-svw items-center justify-center">
	<form
		method="POST"
		use:enhance
		on:submit={() => {
			submited = true;
		}}
	>
		<Card.Root class="mx-auto max-w-sm">
			<Card.Header>
				<Card.Title class="text-xl">Registrarse</Card.Title>
				<Card.Description>Introduzca sus datos para crear una cuenta</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="grid gap-4">
					<div class="grid grid-cols-2 gap-4">
						<div class="grid gap-2">
							<Label for="firstName">Nombre</Label>
							<Input id="firstName" name="firstName" placeholder="Juan" required />
						</div>
						<div class="grid gap-2">
							<Label for="lastName">Apellido</Label>
							<Input id="lastName" name="lastName" placeholder="Perez" required />
						</div>
					</div>
					<div class="grid gap-2">
						<Label for="username">Usuario</Label>
						<Input id="username" name="username" placeholder="juan_perez" required />
					</div>
					<div class="grid gap-2">
						<Label for="email">Email</Label>
						<Input id="email" name="email" type="email" placeholder="username@mail.com" required />
					</div>
					<div class="grid gap-2">
						<Label for="password">Contraseña</Label>
						<Input id="password" name="password" type="password" on:input={verifyPassword} required/>
					</div>
					<div class="grid gap-2">
						<Label for="repeatpassword">Repetir contraseña</Label>
						<Input id="repeatpassword" name="repeatpassword" type="password" on:input={verifyPassword} required/>
					</div>
					<Button type="submit" class="w-full">Crear una cuenta</Button>
				</div>
				<div class="mt-4 text-center text-sm">
					Ya tienes una cuenta?
					<a href="Login" class="underline"> Iniciar sesión </a>
				</div>
			</Card.Content>
		</Card.Root>
	</form>
</div>
