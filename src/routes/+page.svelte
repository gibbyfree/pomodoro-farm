<script>
    import { tick } from 'svelte';

    let now = $state(new Date().toISOString());

    $effect(() => {
        const interval = setInterval(() => {
            now = new Date().toISOString();
        }, 1000);

        return () => clearInterval(interval);
    });

    // Normal pomodoro: 25mins. For dev, 5s.

</script>

<div class="card p-4">Current time: {now}</div>

