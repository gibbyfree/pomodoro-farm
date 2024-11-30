<script lang="ts">
	import type { PageData } from './$types';
	import type { ModalComponent, ModalSettings, PopupSettings } from '@skeletonlabs/skeleton';
	import { PUBLIC_SUPABASE_URL } from '$env/static/public';
	import { Avatar, getModalStore, popup } from '@skeletonlabs/skeleton';
	import { cUser } from '$lib/state/user.svelte';
	import FormModal from '$lib/components/FormModal.svelte';
	import { supabase } from '$lib/supabase';

	let { data }: { data: PageData } = $props();
	let user = data.user ?? { id: 'loading', username: 'loading' };

	const avatarUrl = `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/bluebear2.jpg`;

	const modalStore = getModalStore();
	const popupHover: PopupSettings = {
		event: 'hover',
		target: 'popupHover',
		placement: 'top'
	};

	function usernameForm(userId: any): void {
		const c: ModalComponent = { ref: FormModal };
		const modal: ModalSettings = {
			type: 'component',
			component: c,
			title: 'Howdy, stranger! What should we call you?',
			body: '',
			response: (r) => {
				updateUserDetails(userId, r);
			}
		};
		modalStore.trigger(modal);
	}

	async function updateUserDetails(userId: any, details: any): Promise<void> {
		const { data, error } = await supabase.from('users').update(details).eq('id', userId);
		if (error) {
			console.error('Error updating user details:', error);
		} else {
			console.log('User details updated:', data);
		}
	}
</script>

<div class="grid h-full w-full grid-cols-10 grid-rows-5 gap-4">
	<div class="col-span-3 row-span-3 rounded-xl p-4">
		<Avatar src={avatarUrl} alt="avatar" width="w-full" rounded="rounded-md" />
		{#if user.id !== cUser.id}
			<div class="variant-filled-secondary btn-group my-4 w-full justify-center">
				<button>Add</button>
				<button>Trade</button>
				<button>DM</button>
			</div>
		{:else}
			<div class="my-4 w-full justify-center">
				<button
					type="buton"
					aria-label="Edit"
					class="variant-filled-secondary btn [&>*]:pointer-events-none"
					use:popup={popupHover}
				>
					<i class="fa-solid fa-pencil"></i>
				</button>
			</div>
		{/if}
	</div>
	<div class="col-span-7 col-start-4 row-span-3 rounded-xl">
		<h2 class="h2 mb-2 text-3xl font-extrabold md:text-5xl">
			🎃 {user.username}
		</h2>
		<div class="card mb-2 h-3/4 p-4">
			<section class="text-l font-medium leading-relaxed">i shrimply love to farm</section>
		</div>
		<div class="card h-1/4 p-4">
			<section class="text-l font-medium leading-relaxed">milestones</section>
		</div>
	</div>
</div>

<div class="card variant-filled-secondary p-4" data-popup="popupHover">
	<p>Logout</p>
	<div class="variant-filled-secondary arrow"></div>
</div>
