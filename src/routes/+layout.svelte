<script lang="ts">
	///////////////////// IMPORTS /////////////////////
	import '../app.css';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';

	import '@fortawesome/fontawesome-free/css/all.min.css';

	// Components
	//import {AppBar, Navigation, ToastProvider } from '@skeletonlabs/skeleton-svelte';
	import RegisterModal from '$lib/components/RegisterModal.svelte';
	import TimerCard from '$lib/components/TimerCard.svelte';

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

<!-- <Modal components={modalRegistry} />
<ToastProvider /> -->

{#key cUser.get}
	<main class="grid grid-cols-12 grid-rows-6 gap-4">
		<!-- 		<Navigation class="col-span-1 row-span-6 row-start-1">
			<svelte:fragment slot="lead">
				<AppRailAnchor href="/">(icon)</AppRailAnchor>
			</svelte:fragment>
			<Navigation.Tile bind:group={currentTile} name="tile-1" value={0} title="tile-1">
				<svelte:fragment slot="lead">(icon)</svelte:fragment>
				<span>Tile 1</span>
			</Navigation.Tile>
			<Navigation.Tile bind:group={currentTile} name="tile-2" value={1} title="tile-2">
				<svelte:fragment slot="lead">(icon)</svelte:fragment>
				<span>Tile 2</span>
			</Navigation.Tile>
			<Navigation.Tile bind:group={currentTile} name="tile-3" value={2} title="tile-3">
				<svelte:fragment slot="lead">(icon)</svelte:fragment>
				<span>Tile 3</span>
			</Navigation.Tile>
			<svelte:fragment slot="trail">
				<AppRailAnchor href="/" target="_blank" title="Account">(icon)</AppRailAnchor>
			</svelte:fragment>
			
		</Navigation> -->
		<p>navigation</p>

		<header class="col-span-10 col-start-2 row-start-1">
			<!-- <AppBar
				gridColumns="grid-cols-5"
				slotLead="col-span-1 place-content-start"
				slotDefault="col-start-3 col-span-1 place-content-center"
				slotTrail="col-span-2 place-content-end"
			>
				<svelte:fragment slot="lead">
					<h3 class="h3 font-bold">
						<img src="/logo4.png" alt="Pomo Farm" />
					</h3>
				</svelte:fragment>
				<TimerCard />
				<svelte:fragment slot="trail">
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
							class="preset-filled btn *:pointer-events-none"
							use:popup={popupHover}
							onclick={() => logout()}
						>
							<span>
								<i class="fa-solid fa-right-from-bracket"></i>
							</span>
						</button>
					{/if}
				</svelte:fragment>
			</AppBar> -->
			<p>appbar</p>
		</header>

		<div class="col-span-10 col-start-2 row-span-5 row-start-2 gap-4">
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
		<!-- No user -->

		<div class="card preset-filled-secondary-500 p-4" data-popup="popupHover">
			<p>Logout</p>
			<div class="preset-filled-secondary-500 arrow"></div>
		</div>
	</main>
{/key}
