<script lang="ts">
	///////////////////// IMPORTS ///////////////////// 
	import '../app.css';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';

	import '@fortawesome/fontawesome-free/css/all.min.css';

	// Components
	import { AppBar, getModalStore, popup, ProgressRadial, Modal } from '@skeletonlabs/skeleton';
	import FormModal from '$lib/components/FormModal.svelte';

	// Types
	import type { ModalSettings, ModalComponent, PopupSettings } from '@skeletonlabs/skeleton';
	import type { Snippet } from 'svelte';
	import type { User } from '$lib/types';

	// Functions
	import { getOrCreateUser, updateUser } from '$lib/user';
	import { onMount } from 'svelte';

	// Objects
	import { getSession, supabase } from '$lib/supabase';
	import { cUser } from '$lib/state/user.svelte';

	///////////////////// END IMPORTS /////////////////////

	initializeStores();
	const modalStore = getModalStore();
	let { children }: { children: Snippet } = $props();

	const popupHover: PopupSettings = {
		event: 'hover',
		target: 'popupHover',
		placement: 'top'
	};

	///////////////////// GOOGLE AUTH //////////////////////////
	onMount(() => {
		// Check if user is already signed in
		if (!cUser.email) {
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
			let googleUser = data.user as unknown as User;
			if (googleUser.email) {
				cUser.set = await getOrCreateUser(supabase, googleUser.email) as User;
			}
		};

		displayGoogleButtons();
	});

	function displayGoogleButtons() {
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
				logo_alignment: 'left',
				width: 350
			});
		};
		document.body.appendChild(script);
	}
	///////////////////// GOOGLE AUTH //////////////////////////

	async function logout() {
		await supabase.auth.signOut();
		displayGoogleButtons();
		cUser.set = {} as User;
	}

	async function registerUsername(userId: any, r: Record<string, any>) {
		cUser.set = await updateUser(supabase, userId, r);
	}

	async function getLoggedInUser(): Promise<User | Record<string, never>> {
		let session = await getSession();
		if (session) {
			cUser.set = await getOrCreateUser(supabase, session.user.email) as User;
		}
		return {};
	}

	function usernameForm(userId: any): void {
		const c: ModalComponent = { ref: FormModal };
		const modal: ModalSettings = {
			type: 'component',
			component: c,
			title: 'Howdy, stranger! What should we call you?',
			body: '',
			response: (r) => {
				registerUsername(userId, r);
			}
		};
		modalStore.trigger(modal);
	}

	console.log("bottom of layout", cUser.get);
</script>

<Modal />
{#key cUser.get}
	<main class="space-y-4 p-4">
		<header class="p4">
			<AppBar>
				<svelte:fragment slot="lead">
					<i class="fa-solid fa-wheat-awn text-xl"></i>
				</svelte:fragment>
				<h2 class="h2 font-bold">Pomo Farm</h2>
				<svelte:fragment slot="trail">
					{#if cUser.email}
						<span class="text-xl">{cUser.username}</span>
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

		<!-- No user -->
		{#if !cUser.email && !cUser.username}
			<div class="card p-4">
				<header class="card-header">
					<h3 class="h3">Welcome to Pomo Farm! Sign in with Google continue.</h3>
				</header>
				<section class="p-4" id="google-btn-wrapper">
					<div id="g_id_onload"></div>
					<div id="g_id_signin"></div>
				</section>
			</div>
			<!-- Unregistered user -->
		{:else if cUser.email && cUser.email === cUser.username}
			<div class="card p-4">
				<header class="card-header">
					<h3 class="h3">Nice to meet you, Farmer!</h3>
				</header>
				<section class="p-4">
					<span>Complete your farmer registration form:</span>
				</section>
				<footer class="card-footer">
					<button class="variant-filled btn" onclick={() => usernameForm(cUser.id)}>
						<span><i class="fa-regular fa-clipboard"></i></span>
						<span>Farmer Registration</span>
					</button>
				</footer>
			</div>
			<!-- Registered and signed in -->
		{:else if cUser.username !== cUser.email}
			{@render children()}
		{/if}

		<div class="card variant-filled-secondary p-4" data-popup="popupHover">
			<p>Logout</p>
			<div class="variant-filled-secondary arrow"></div>
		</div>
	</main>
{/key}
