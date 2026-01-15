<script lang="ts">
	import UsernameDialog from './UsernameDialog.svelte';
	import { cUser } from '$lib/state/user.svelte';
	import { getOrCreateUser, updateUser } from '$lib/user';
	import { supabase, getSession } from '$lib/supabase';
	import { onMount } from 'svelte';
	import type { User } from '$lib/types';

	let showUsernameDialog = $state(false);

	onMount(() => {
		if (!cUser.email) {
			getLoggedInUser();
		}
		setupGoogleSignIn();
	});

	///////////////////// GOOGLE AUTH //////////////////////////
	function setupGoogleSignIn() {
		// Define the handleSignInWithGoogle function BEFORE loading the script
		// @ts-ignore
		window.handleSignInWithGoogle = async function (response) {
			const { data, error } = await supabase.auth.signInWithIdToken({
				provider: 'google',
				token: response.credential
			});

			let googleUser = data.user as unknown as User;

			if (googleUser.email) {
				const user = (await getOrCreateUser(googleUser.email)) as User;
				cUser.set = user;
			}
		};

		// Only load Google script once
		if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
			loadGoogleScript();
		} else {
			initializeGoogleSignIn();
		}
	}

	function initializeGoogleSignIn() {
		// @ts-ignore
		if (window.google && window.google.accounts) {
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

			const buttonElement = document.getElementById('g_id_onload');
			if (buttonElement) {
				// @ts-ignore
				window.google.accounts.id.renderButton(buttonElement, {
					type: 'standard',
					shape: 'pill',
					theme: 'outline-solid',
					text: 'signin_with',
					size: 'large',
					logo_alignment: 'left',
					width: 350
				});
			}
		}
	}

	function loadGoogleScript() {
		const script = document.createElement('script');
		script.src = 'https://accounts.google.com/gsi/client';
		script.async = true;
		script.onload = () => initializeGoogleSignIn();
		document.body.appendChild(script);
	}
	///////////////////// END GOOGLE AUTH //////////////////////////

	async function getLoggedInUser(): Promise<void> {
		let session = await getSession();
		if (session) {
			cUser.set = (await getOrCreateUser(session.user.email)) as User;
		}
	}

	async function handleUsernameSubmit(username: string) {
		const updatedUser = await updateUser(cUser.id, { username });
		cUser.set = updatedUser;
	}

	function openUsernameDialog() {
		showUsernameDialog = true;
	}
</script>

<!-- Not signed in -->
{#if !cUser.email && !cUser.username}
	<div class="card p-4">
		<header class="card-header">
			<h3 class="h3">Welcome to Pomo Farm! Sign in with Google to continue.</h3>
		</header>
		<section class="p-4" id="google-btn-wrapper">
			<div id="g_id_onload"></div>
			<div id="g_id_signin"></div>
		</section>
	</div>

	<!-- Signed in but no username set (email === username means unregistered) -->
{:else if cUser.email && cUser.email === cUser.username}
	<div class="card p-4">
		<header class="card-header">
			<h3 class="h3">Nice to meet you, Farmer!</h3>
		</header>
		<section class="p-4">
			<span>Complete your farmer registration form:</span>
		</section>
		<footer class="card-footer">
			<button class="preset-filled btn" onclick={openUsernameDialog}>
				<span><i class="fa-regular fa-clipboard"></i></span>
				<span>Farmer Registration</span>
			</button>
		</footer>
	</div>

	<UsernameDialog bind:open={showUsernameDialog} onSubmit={handleUsernameSubmit} />
{/if}
