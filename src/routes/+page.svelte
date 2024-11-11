<script>
	import '@fortawesome/fontawesome-free/css/all.min.css';
    import { ProgressBar } from '@skeletonlabs/skeleton';

    // Normal pomodoro: 25mins. For dev, 1.
    const timerMins = 1;
    const maxRemaining = timerMins * 60 * 1000;

	let now = $state(new Date());
	let end = $state(new Date());
    let remaining = $state(0);
    
    let remainingPct = $derived.by(() => {
        return Math.floor((remaining / maxRemaining) * 100);
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

<div class="card p-4">
	<header class="card-header">Pomo Farm</header>
	<section class="p-4">Current time: {now.toUTCString()}</section>
    {#if disabled}
	    <footer class="card-footer">
            End time: {end.toUTCString()}
            <ProgressBar value={remainingPct} max={100} />
        </footer>
    {/if}
    {#if done}
        <footer class="card-footer">Done!</footer>
    {/if}
</div>

<button
    disabled={disabled}
	type="button"
	class="btn variant-filled btn-lg"
	onclick={() => setTimer()}>
	<span> <i class="fa-regular fa-tractor"> </i></span>
	<span>Set Timer</span>
</button>

{@debug remaining}