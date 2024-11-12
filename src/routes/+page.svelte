<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.min.css';

	import {
		AppBar,
		ProgressBar,
	} from '@skeletonlabs/skeleton';

    import { createClient } from '@supabase/supabase-js';
    import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
    import { onMount } from 'svelte';

    let userData = $state(null);

    onMount(() => {
        const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

        // Define the handleSignInWithGoogle function
        // @ts-ignore
        window.handleSignInWithGoogle = async function (response) {     
            const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: response.credential,
            })

            userData = (data.user?.user_metadata.name);
        };

        // Load the Google Sign-In library
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.onload = function () {
            // Initialize the Google Sign-In library
            // @ts-ignore
            window.google.accounts.id.initialize({
                client_id: '853122399782-rq5ked5t72qg31umbf6618iquiuuoqlb.apps.googleusercontent.com',
                // @ts-ignore
                callback: window.handleSignInWithGoogle,
                context: 'signin',
                ux_mode: 'popup',
                nonce: '',
                auto_select: true,
                itp_support: true
            });
            // @ts-ignore
            window.google.accounts.id.renderButton(document.getElementById('g_id_onload'), {
                type: 'standard',
                shape: 'pill',
                theme: 'outline',
                text: 'signin_with',
                size: 'large',
                logo_alignment: 'left'
            });
        };
        document.body.appendChild(script);
    });

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

<main class="p-4 space-y-4">
	<header class="p4">
		<AppBar>
			<svelte:fragment slot="lead">
				<i class="fa-solid fa-wheat-awn"></i>
			</svelte:fragment>
			<h2 class="h2 font-bold">Pomo Farm</h2>
			<svelte:fragment slot="trail">
                {#if !userData}
                    <div id="g_id_onload"></div>
                    <div id="g_id_signin"></div>
                {/if}
			</svelte:fragment>
		</AppBar>
	</header>

	<div class="card p-4">
		<header class="card-header">
            {#if userData}
                <h3 class="h3">Welcome, {userData}!</h3>
            {:else}
                <h3 class="h3">Welcome, Farmer!</h3>
            {/if}
        </header>
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

	<button {disabled} type="button" class="btn variant-filled btn-lg" onclick={() => setTimer()}>
		<span> <i class="fa-regular fa-tractor"> </i></span>
		<span>Set Timer</span>
	</button>
</main>
