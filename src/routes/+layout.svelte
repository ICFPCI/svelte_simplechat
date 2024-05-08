<script lang="ts">
	import '../app.pcss';
	import { ModeWatcher } from "mode-watcher";
	import { Toaster } from "$lib/components/ui/sonner";
</script>

<Toaster position="top-right" closeButton />
<ModeWatcher />
<slot />
