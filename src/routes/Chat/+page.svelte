<script lang="ts">
	import { onMount } from 'svelte';
	import Chat from './(components)/chat.svelte';
	export let data;
</script>

{#if !data.error}
	<Chat conversations={data.conversations} defaultLayout={data.layout} />
{:else}
	<h1>{data.error}</h1>
{/if}
