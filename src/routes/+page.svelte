<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.min.css';

	// Components
	import { AppBar, getModalStore, popup, ProgressRadial, Modal } from '@skeletonlabs/skeleton';
	import FormModal from '$lib/components/FormModal.svelte';

	// Types
	import type { ModalSettings, ModalComponent, PopupSettings } from '@skeletonlabs/skeleton';
	import type { User } from '$lib/user';

	// Functions
	import { getOrCreateUser, updateUser } from '$lib/user';
	import { getSession } from '$lib/supabase';
	import { onMount } from 'svelte';

	// Objects
	import { supabase } from '$lib/supabase';

	const modalStore = getModalStore();
	const popupHover: PopupSettings = {
		event: 'hover',
		target: 'popupHover',
		placement: 'top'
	};

	let user: User | Record<string, never> = $state({});
	let userEmail: string = $derived(user.email);
	let userId: string = $derived(user.id);
	let username: string = $derived(user.username);

	///////////////////// GOOGLE AUTH //////////////////////////
	onMount(() => {
		// Check if user is already signed in
		if (!userEmail) {
			getLoggedInUser();
		}

		// Define the handleSignInWithGoogle function
		// @ts-ignore
		window.handleSignInWithGoogle = async function (response) {
			const { data, error } = await supabase.auth.signInWithIdToken({
				provider: 'google',
				token: response.credential
			});

			if (error) {
				console.error('Error logging in with Google:', error.message);
				return;
			}

			// Get user data
			user = data.user as unknown as User;
			if (userEmail) {
				user = await getOrCreateUser(supabase, userEmail);
			}
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
	///////////////////// GOOGLE AUTH //////////////////////////

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

	async function registerUser(userId: any, r: Record<string, any>) {
		user = await updateUser(supabase, userId, r);
	}

	async function getLoggedInUser() {
		let session = await getSession();
		if (session) {
			user = await getOrCreateUser(supabase, session.user.email);
		}
	}

	async function logout() {
		await supabase.auth.signOut();
		user = {};
	}

	// END BACKEND

	// UI
	function usernameForm(userId: any): void {
		const c: ModalComponent = { ref: FormModal };
		const modal: ModalSettings = {
			type: 'component',
			component: c,
			title: 'Howdy, stranger! What should we call you?',
			body: '',
			response: (r) => {
				registerUser(userId, r);
			}
		};
		modalStore.trigger(modal);
	}
</script>

<Modal />

<main class="space-y-4 p-4">
	{#key user}
	<header class="p4">
		<AppBar>
			<svelte:fragment slot="lead">
				<i class="fa-solid fa-wheat-awn text-xl"></i>
			</svelte:fragment>
			<h2 class="h2 font-bold">Pomo Farm</h2>
			<svelte:fragment slot="trail">
				{#if !userEmail}
					<div id="g_id_onload"></div>
					<div id="g_id_signin"></div>
				{:else if username}
					<span class="text-xl">{username}</span>
					<button
						aria-label="Logout"
						class="variant-filled btn [&>*]:pointer-events-none"
						use:popup={popupHover}
						onclick={() => logout()}
					>
						<span>
							<i class="fa-solid fa-right-from-bracket"></i>
						</span>
					</button>
				{/if}
			</svelte:fragment>
		</AppBar>
	</header>

		<div class="card p-4">
			<header class="card-header">
				{#if userEmail && userEmail === username}
					<h3 class="h3">Nice to meet you, Farmer!</h3>
					<button class="variant-filled btn" onclick={() => usernameForm(userId)}>
						<span><i class="fa-regular fa-clipboard"></i></span>
						<span>Farmer Registration</span>
					</button>
				{:else if username}
					<h3 class="h3">Welcome back, {username}!</h3>
				{:else}
					<h3 class="h3">Welcome, Farmer!</h3>
				{/if}
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
	{/key}

	<button {disabled} type="button" class="variant-filled btn btn-lg" onclick={() => setTimer()}>
		<span> <i class="fa-regular fa-tractor"> </i></span>
		<span>Set Timer</span>
	</button>
</main>

<div class="card variant-filled-secondary p-4" data-popup="popupHover">
	<p>Logout</p>
	<div class="variant-filled-secondary arrow"></div>
</div>
