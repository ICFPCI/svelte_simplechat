<script lang="ts">
	import { onMount } from 'svelte';
	import Chat from './(components)/chat.svelte';
	export let data;
</script>

{#if !data.error}
	<Chat defaultLayout={data.layout} conversations={data.conversations} contacts={data.contacts} />
{:else}
	<h1>{data.error}</h1>
{/if}
