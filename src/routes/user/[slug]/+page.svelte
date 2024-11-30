<script lang="ts">
	import type { PageData } from './$types';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { PUBLIC_SUPABASE_URL } from '$env/static/public';
	import { Avatar, FileDropzone, popup } from '@skeletonlabs/skeleton';
	import { cUser } from '$lib/state/user.svelte';
	import type { Profile } from '$lib/types';
	import { updateUser } from '$lib/user';
	import { supabase } from '$lib/supabase';

	let { data }: { data: PageData } = $props();
	let user = data.user ?? { id: 'loading', username: 'loading', profile: null };

	let isEditing = $state(false);

	let files: FileList;
	let formData: {
		bio: string | null;
	} = {
		bio: null
	};

	const avatarUrl = `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/bluebear2.jpg`;

	const popupHover: PopupSettings = {
		event: 'hover',
		target: 'popupHover',
		placement: 'bottom'
	};

	async function handleProfileEdit() {
		if (isEditing) {
			if (files) {
				//const iconBuffer = await files[0].arrayBuffer();
				//formData.iconBuffer = iconBuffer;
			}
			if (Object.values(formData).some((value) => value !== null)) {
				let currProfile = user.profile ?? {};
				let newProfile: Profile = {
					...currProfile,
					...formData
				};
				user.profile = newProfile;
				await updateUser(supabase, cUser.id, { profile: newProfile });
			}
		}
		// Toggle edit mode
		isEditing = !isEditing;
	}
</script>

<div class="grid h-full w-full grid-cols-10 grid-rows-5 gap-4">
	<div class="col-span-3 row-span-3 rounded-xl p-4">
		{#if isEditing}
			<FileDropzone name="files" bind:files>
				<svelte:fragment slot="lead"><i class="fa-solid fa-file-arrow-up"></i></svelte:fragment>
				<svelte:fragment slot="message">Upload a profile picture</svelte:fragment>
				<svelte:fragment slot="meta">PNG, JPG allowed</svelte:fragment>
			</FileDropzone>
		{:else}
			<Avatar src={avatarUrl} alt="avatar" width="w-full" rounded="rounded-md" />
		{/if}
		{#if user.id !== cUser.id}
			<div class="variant-filled-secondary btn-group my-4 w-full justify-center">
				<button>Add</button>
				<button>Trade</button>
				<button>DM</button>
			</div>
		{:else}
			<div class="my-4 w-full justify-center">
				<button
					type="button"
					aria-label="Edit"
					class="variant-filled-secondary btn [&>*]:pointer-events-none"
					use:popup={popupHover}
					onclick={() => handleProfileEdit()}
				>
					{#if isEditing}
						<i class="fa-solid fa-check"></i>
					{:else}
						<i class="fa-solid fa-pencil"></i>
					{/if}
				</button>
			</div>
		{/if}
	</div>
	<div class="col-span-7 col-start-4 row-span-3 rounded-xl">
		<h2 class="h2 mb-2 text-3xl font-extrabold md:text-5xl">
			🎃 {user.username}
		</h2>
		<div class="card mb-2 h-3/4 p-4">
			{#if isEditing}
				<!--svelte-ignore element_invalid_self_closing_tag-->
				<textarea
					bind:value={formData.bio}
					class="textarea"
					rows="8"
					placeholder={user.profile.bio}
				/>
			{:else}
				<section class="text-l font-medium leading-relaxed">{user.profile.bio}</section>
			{/if}
		</div>
		<div class="card h-1/4 p-4">
			<section class="text-l font-medium leading-relaxed">milestones</section>
		</div>
	</div>
</div>

<div class="card variant-filled-secondary p-4" data-popup="popupHover">
	{#if isEditing}
		<p>Save</p>
	{:else}
		<p>Edit Profile</p>
	{/if}
	<div class="variant-filled-secondary arrow"></div>
</div>
