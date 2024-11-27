<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.min.css';

	// Types
	import type { User } from '$lib/types';

	// Objects
	import { cUser } from '$lib/state/user.svelte';
	import { cTimer } from '$lib/state/timer.svelte';

	let user: User | Record<string, never> = cUser.get;
	let timer = cTimer;
</script>

{#if user.username}
	<div class="card mb-5 p-4">
		<header class="card-header">
			<h3 class="h3">Welcome back, {user.username}!</h3>
		</header>
		<section class="p-4">Turnips grouwing. They are done soon.</section>
	</div>

	{#if cTimer.done}
		<div class="grid grid-cols-4 gap-2">
			<div class="card p-4">
				<header class="card-header">Task</header>
				<section class="p-4">CHOOSE SOEMTHING</section>
			</div>
			<div class="card p-4">
				<header class="card-header">Task</header>
				<section class="p-4">CHOOSE SOEMTHING</section>
			</div>
			<div class="card p-4">
				<header class="card-header">Task</header>
				<section class="p-4">CHOOSE SOEMTHING</section>
			</div>
			<div class="card p-4">
				<header class="card-header">Task</header>
				<section class="p-4">CHOOSE SOEMTHING</section>
			</div>
		</div>
	{/if}
{/if}
