<script lang="ts">
	export let username: string;
	export let created: Date;
	export let text: string;

	function getDateHour(fecha: Date): string {
		const fechaActual = new Date();
        fecha = new Date(fecha);

		if (
			fechaActual.getFullYear() === fecha.getFullYear() &&
			fechaActual.getMonth() === fecha.getMonth() &&
			fechaActual.getDate() === fecha.getDate()
		) {
			const hora = fecha.getHours();
			const minutos = fecha.getMinutes();
			return `${hora}:${minutos < 10 ? '0' : ''}${minutos}`;
		} else {
			const dia = fecha.getDate();
			const mes = fecha.getMonth() + 1;
			const año = fecha.getFullYear() % 100;
			const hora = fecha.getHours();
			const minutos = fecha.getMinutes();
			return `${dia < 10 ? '0' : ''}${dia}/${mes < 10 ? '0' : ''}${mes}/${año} ${hora}:${minutos < 10 ? '0' : ''}${minutos}`;
		}
	}
</script>

<div class="flex items-start gap-2.5">
	<div class="flex w-full max-w-[420px] flex-col gap-1 py-3">
		<div class="flex items-center space-x-2 rtl:space-x-reverse">
			<span class="text-sm font-semibold text-gray-900 dark:text-white">{username}</span>
			<span class="text-sm font-normal text-gray-500 dark:text-gray-400"
				>{getDateHour(created)}</span
			>
		</div>
		<div
			class="leading-1.5 flex flex-col  rounded-r-xl rounded-bl-xl border-gray-200 bg-gray-100 p-4 dark:bg-muted"
		>
			<p class="break-words text-sm font-normal text-gray-900 dark:text-white">
				{text}
			</p>
		</div>
	</div>
</div>
