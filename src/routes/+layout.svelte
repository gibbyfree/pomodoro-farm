<script lang="ts">
	///////////////////// IMPORTS /////////////////////
	import '../app.css';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';

	import '@fortawesome/fontawesome-free/css/all.min.css';

	// Components
	//import {AppBar, Navigation, ToastProvider } from '@skeletonlabs/skeleton-svelte';
	import { AppBar, Toast } from '@skeletonlabs/skeleton-svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import RegisterModal from '$lib/components/RegisterModal.svelte';
	import TimerCard from '$lib/components/TimerCard.svelte';
	import { toaster } from '$lib/toaster';

	// Types
	//import type { ModalSettings, ModalComponent, PopupSettings } from '@skeletonlabs/skeleton-svelte';
	import type { Snippet } from 'svelte';
	import type { User } from '$lib/types';

	// Functions
	import { getOrCreateUser, updateUser } from '$lib/user';
	import { getLevelFromXp } from '$lib/level';
	import { onMount } from 'svelte';

	// Objects
	import { getSession, supabase } from '$lib/supabase';
	import { cUser } from '$lib/state/user.svelte';

	///////////////////// END IMPORTS /////////////////////

	//initializeStores();
	//const modalStore = getModalStore();
	//storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	let { children }: { children: Snippet } = $props();
	let currentTile: number = $state(0);

	/* 	const modalRegistry: Record<string, ModalComponent> = {
		registerModal: { ref: RegisterModal }
	};

	const popupHover: PopupSettings = {
		event: 'hover',
		target: 'popupHover',
		placement: 'top'
	};
 */
	///////////////////// GOOGLE AUTH //////////////////////////
	onMount(() => {
		// Check if user is already signed in
		if (!cUser.email) {
			getLoggedInUser();
		}
		// Define the handleSignInWithGoogle function BEFORE loading the script
		// @ts-ignore
		window.handleSignInWithGoogle = async function (response) {
			const { data, error } = await supabase.auth.signInWithIdToken({
				provider: 'google',
				token: response.credential
			});

			// Get user data
			let googleUser = data.user as unknown as User;

			if (googleUser.email) {
				const user = (await getOrCreateUser(googleUser.email)) as User;
				cUser.set = user;
			} else {
			}
		};

		// Only load Google script once
		if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
			displayGoogleButtons();
		} else {
			initializeGoogleSignIn();
		}
	});

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

	function displayGoogleButtons() {
		// Load the Google Sign-In library
		const script = document.createElement('script');
		script.src = 'https://accounts.google.com/gsi/client';
		script.async = true;
		document.body.appendChild(script);
	}
	///////////////////// GOOGLE AUTH //////////////////////////

	async function logout() {
		await supabase.auth.signOut();
		displayGoogleButtons();
		cUser.set = {} as User;
	}

	async function registerUsername(userId: any, r: Record<string, any>) {
		cUser.set = await updateUser(userId, r);
	}

	async function getLoggedInUser(): Promise<User | Record<string, never>> {
		let session = await getSession();
		if (session) {
			cUser.set = (await getOrCreateUser(session.user.email)) as User;
		}
		return {};
	}

	function usernameForm(userId: any): void {
		/* 		const modal: ModalSettings = {
			type: 'component',
			component: 'registerModal',
			title: 'Howdy, stranger! What should we call you?',
			body: '',
			response: (r) => {
				registerUsername(userId, r);
			}
		};
		modalStore.trigger(modal); */
	}
</script>

<!-- <Modal components={modalRegistry} /> -->

<Toast.Group {toaster}>
	{#snippet children(toast)}
		<Toast {toast} class="preset-filled-primary-500 card min-w-80 p-4 shadow-lg">
			<Toast.Message class="flex flex-col gap-2">
				<Toast.Title class="text-lg font-bold">{toast.title}</Toast.Title>
				<Toast.Description class="text-base opacity-80">{toast.description}</Toast.Description>
			</Toast.Message>
			{#if toast.closable}
				<Toast.CloseTrigger class="btn-icon preset-tonal-primary" />
			{/if}
		</Toast>
	{/snippet}
</Toast.Group>

{#key cUser.get}
	<main class="grid min-h-screen grid-cols-[auto_1fr]">
		<!-- Sidebar -->
		<Sidebar />

		<!-- Main content area -->
		<div class="flex flex-col">
			<header class="border-surface-200-800 border-b p-4">
				<AppBar>
					<AppBar.Toolbar class="flex w-full items-center justify-end">
						<AppBar.Trail class="flex items-center gap-6 text-lg">
							{#if cUser.email}
								<ul class="list">
									<li>
										<span>lv{getLevelFromXp(cUser.xp)}</span>
										<span class="flex-auto">
											<a href={`/user/${cUser.username}`}> {cUser.username}</a>
										</span>
									</li>
									<li>
										<span>💰</span>
										<span class="flex-auto">{cUser.doro}</span>
									</li>
								</ul>
								<button
									aria-label="Logout"
									class="preset-filled btn btn-lg *:pointer-events-none"
									onclick={() => logout()}
								>
									<span>
										<i class="fa-solid fa-right-from-bracket"></i>
									</span>
								</button>
							{/if}
						</AppBar.Trail>
					</AppBar.Toolbar>
					<AppBar.Headline class="flex justify-center py-4">
						<TimerCard />
					</AppBar.Headline>
				</AppBar>
			</header>

			<div class="flex-1 p-6">
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
							<button class="preset-filled btn" onclick={() => usernameForm(cUser.id)}>
								<span><i class="fa-regular fa-clipboard"></i></span>
								<span>Farmer Registration</span>
							</button>
						</footer>
					</div>
					<!-- Registered and signed in -->
				{:else if cUser.username !== cUser.email}
					{@render children()}
				{/if}
			</div>
		</div>
	</main>
{/key}
