<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.min.css';

	// Types
	import type { User } from '$lib/types';

	// Objects
	import { cUser } from '$lib/state/user.svelte';

	let user: User | Record<string, never> = cUser.get;
</script>

{#if user.username}
	<div class="card p-4">
		<header class="card-header">
			<h3 class="h3">Welcome back, {user.username}!</h3>
		</header>
		<section class="p-4">
			Current time: {new Date().toUTCString()}
		</section>
	</div>
{/if}
