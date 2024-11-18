<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.min.css';

	// Components
	import { getModalStore, ProgressRadial } from '@skeletonlabs/skeleton';

	// Types
	import type { User } from '$lib/types';
	import type { PageData } from './$types';

	// Objects
	import { cUser } from '$lib/state/user.svelte';

	const modalStore = getModalStore();

	let user: User | Record<string, never> = cUser.get;

	// Normal pomodoro: 25mins. For dev, 1.
	// BACKEND
	const timerMins = 25;
	const maxRemaining = timerMins * 60 * 1000;

	let now = $state(new Date());
	let end = $state(new Date());
	let remaining = $state(0);

	let completedPct = $derived.by(() => {
		return Math.floor(((maxRemaining - remaining) / maxRemaining) * 100);
	});

	let remainingMins = $derived.by(() => {
		return Math.floor(remaining / 60000);
	});

	let remainingSecs = $derived.by(() => {
		return Math.floor((remaining % 60000) / 1000);
	});

	let done = $state(false);
	let disabled = $state(false);

	$effect.root(() => {
		const storedEnd = localStorage.getItem('end');
		if (storedEnd) {
			end = new Date(storedEnd);
			disabled = true;
		}
	});

	$effect(() => {
		const interval = setInterval(() => {
			now = new Date();
			if (now >= end) {
				done = true;
				disabled = false;
				localStorage.removeItem('end');
			}
			remaining = end.getTime() - now.getTime();
		}, 500);

		return () => clearInterval(interval);
	});

	function setTimer() {
		if (disabled) {
			return end;
		} else {
			disabled = true;
			done = false;

			let newEnd = new Date(end.setMinutes(now.getMinutes() + timerMins));
			localStorage.setItem('end', newEnd.toISOString());
			return newEnd;
		}
	}
</script>

{#if user.username}
	<div class="card p-4">
		<header class="card-header">
			<h3 class="h3">Welcome back, {user.username}!</h3>
		</header>
		<section class="p-4">
			Current time: {now.toUTCString()}
		</section>
		{#if disabled}
			<footer class="card-footer">
				End time: {end.toUTCString()}
				<ProgressRadial value={completedPct} max={100}>
					{remainingMins}m {remainingSecs}s
				</ProgressRadial>
			</footer>
		{/if}
		{#if done}
			<footer class="card-footer">Done!</footer>
		{/if}
	</div>

	<button {disabled} type="button" class="variant-filled btn btn-lg" onclick={() => setTimer()}>
		<span> <i class="fa-regular fa-tractor"> </i></span>
		<span>Set Timer</span>
	</button>
{/if}
