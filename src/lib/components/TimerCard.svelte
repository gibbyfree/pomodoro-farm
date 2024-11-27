<script lang="ts">
	import { getToastStore, ProgressRadial } from '@skeletonlabs/skeleton';
	import { cTimer } from '$lib/state/timer.svelte';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { TimerType } from '$lib/types';

	const toastStore = getToastStore();

	const t: ToastSettings = {
		message: 'Time to work!',
		timeout: 5000
	};

	$effect(() => {
		const interval = setInterval(() => {
			const end = cTimer.end;
			if (!end) return;
			if (new Date() >= end) {
				let setting = cTimer.setting;
				localStorage.removeItem('end');

				if (setting === TimerType.DORO) {
					// cooldown time!
					const newEnd = new Date(new Date().getTime() + cooldownMins * 60000);
					cTimer.end = newEnd;
					localStorage.setItem('end', newEnd.toISOString());

					cTimer.setting = TimerType.COOLDOWN;
					localStorage.setItem('setting', '1');
				} else {
					// wait til next doro time!
					cTimer.done = true;
				}
			}
			remaining = end.getTime() - new Date().getTime();
		}, 500);

		return () => clearInterval(interval);
	});

	// shorter values for local dev
	const timerMins = 1;
	const cooldownMins = 1;
	let remaining = $state(0);

	let completedPct = $derived.by(() => {
		const maxRemaining =
			cTimer.setting === TimerType.DORO ? timerMins * 60 * 1000 : cooldownMins * 60 * 1000;
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
		let newEnd = new Date(new Date().getTime() + timerMins * 60000);
		localStorage.setItem('end', newEnd.toISOString());
		localStorage.setItem('setting', '0');

		cTimer.end = newEnd;
		cTimer.setting = TimerType.DORO;
		toastStore.trigger(t);
	}

	function getSetting() {}
</script>

<div class="card grid grid-cols-2 grid-rows-2 p-4">
	<ProgressRadial
		width={'w-12'}
		value={completedPct}
		min={0}
		max={100}
		stroke={120}
		meter={cTimer.setting == TimerType.DORO ? 'stroke-primary-500' : 'stroke-success-500'}
		track="stroke-primary-500/30"
		strokeLinecap="round"
	/>
	{#if cTimer.done}
		<!-- New timer can be set -->
		<button class="variant-filled chip hover:variant-filled-primary" onclick={() => setTimer()}>
			<span> <i class="fa-solid fa-stopwatch"></i></span>
			<span>Set</span>
		</button>
	{:else}
		<!-- Timer is running -->
		{#if cTimer.setting == TimerType.DORO}
			<!-- because player is working -->
			<span class="variant-filled badge">Time to work!</span>
		{:else if cTimer.setting == TimerType.COOLDOWN}
			<!-- because player is resting -->
			<span class="variant-filled badge">Time to rest!</span>
		{/if}
		<span class="variant-filled badge">{remainingMins}m {remainingSecs}s</span>
	{/if}
</div>
