<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { cTimer } from '$lib/state/timer.svelte';

	let now = $state(new Date());

	$effect(() => {
		const interval = setInterval(() => {
			now = new Date();
			const end = cTimer.end;
			if (now >= end) {
				cTimer.done = true;
				localStorage.removeItem('end');
			}
			remaining = end.getTime() - now.getTime();
		}, 500);

		return () => clearInterval(interval);
	});

	const timerMins = 1;
	const maxRemaining = timerMins * 60 * 1000;
	let remaining = $state(0);

	let completedPct = $derived.by(() => {
		let pct = Math.floor(((maxRemaining - remaining) / maxRemaining) * 100);
		return pct > 100 ? 100 : pct;
	});

	let remainingMins = $derived.by(() => {
		return Math.floor(remaining / 60000);
	});

	let remainingSecs = $derived.by(() => {
		return Math.floor((remaining % 60000) / 1000);
	});

	function setTimer() {
		let newEnd = new Date(now.getTime() + timerMins * 60000);
		localStorage.setItem('end', newEnd.toISOString());
		cTimer.end = newEnd;
		cTimer.done = false;
	}
</script>

<div class="card grid grid-cols-2 p-4">
	<ProgressRadial
		width={'w-12'}
		value={completedPct}
		min={0}
		max={100}
		stroke={120}
		meter="stroke-primary-500"
		track="stroke-primary-500/30"
		strokeLinecap="round"
		class="col-span-1"
	/>
	{#if cTimer.done}
		<button class="variant-filled chip hover:variant-filled-primary" onclick={() => setTimer()}>
			<span> <i class="fa-solid fa-stopwatch"></i></span>
			<span>Set</span>
		</button>
	{:else}
		<span class="variant-filled badge">{remainingMins}m {remainingSecs}s</span>
	{/if}
</div>
