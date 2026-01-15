<script lang="ts">
	import '../app.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';

	// Components
	import { AppBar, Toast } from '@skeletonlabs/skeleton-svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import TimerCard from '$lib/components/TimerCard.svelte';
	import RegistrationFlow from '$lib/components/RegistrationFlow.svelte';
	import { toaster } from '$lib/toaster';

	// Types
	import type { Snippet } from 'svelte';
	import type { User } from '$lib/types';

	// Functions
	import { getLevelFromXp } from '$lib/level';

	// Objects
	import { supabase } from '$lib/supabase';
	import { cUser } from '$lib/state/user.svelte';

	let { children }: { children: Snippet } = $props();

	async function logout() {
		await supabase.auth.signOut();
		cUser.set = {} as User;
	}
</script>

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
				{#if cUser.username && cUser.username !== cUser.email}
					<!-- Registered and signed in - show main content -->
					{@render children()}
				{:else}
					<!-- Not signed in or needs registration -->
					<RegistrationFlow />
				{/if}
			</div>
		</div>
	</main>
{/key}
