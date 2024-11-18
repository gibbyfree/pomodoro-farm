<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let user = data.user ?? { id: 'loading' };
</script>

<div class="grid grid-rows-4 grid-flow-col gap-4 px-4 py-4 leading-10">
    <div class="p-4 w-full bg-fuchsia-900 rounded-xl row-span-3">1</div>
    <div class="p-4 w-full bg-fuchsia-800 rounded-xl">2</div>
	<div class="p-4 w-full bg-fuchsia-800 rounded-xl">3</div>
    <div class="p-4 w-full bg-fuchsia-700 rounded-xl row-span-3 col-span-2">4</div>
</div>

<h1>{user.id}</h1>