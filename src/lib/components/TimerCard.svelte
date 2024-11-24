<script lang="ts">
	import { getToastStore, ProgressRadial } from '@skeletonlabs/skeleton';
	import { cTimer } from '$lib/state/timer.svelte';
	import type { ToastSettings } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();
	let now = $state(new Date());

	const t: ToastSettings = {
		message: 'Time to work!',
		timeout: 5000
	};

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
		let mins = Math.floor(remaining / 60000);
		return mins <= 0 ? 0 : mins;
	});

	let remainingSecs = $derived.by(() => {
		let secs = Math.floor((remaining % 60000) / 1000);
		return secs <= 0 ? 0 : secs;
	});

	function setTimer() {
		let newEnd = new Date(now.getTime() + timerMins * 60000);
		localStorage.setItem('end', newEnd.toISOString());
		cTimer.end = newEnd;
		cTimer.done = false;
		toastStore.trigger(t);
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
