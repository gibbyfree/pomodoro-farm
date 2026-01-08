<script lang="ts">
	import type { PageData } from './$types';
	//import type { PopupSettings, FileUpload } from '@skeletonlabs/skeleton-svelte';
	//import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import { cUser } from '$lib/state/user.svelte';
	import type { Profile } from '$lib/types';
	import { updateUser } from '$lib/user';

	let { data }: { data: PageData } = $props();
	let user = data.user ?? { id: 'loading', username: 'loading', profile: null };

	let isEditing = $state(false);

	// svelte-ignore non_reactive_update
	let files: FileList;
	let formData: {
		bio: string | null;
	} = {
		bio: null
	};

	const avatarUrl = `https://pomofarms.s3.us-east-2.amazonaws.com/bluebear.png`;

	/* 	const popupHover: PopupSettings = {
		event: 'hover',
		target: 'popupHover',
		placement: 'bottom'
	}; */

	async function handleProfileEdit() {
		if (isEditing) {
			if (files) {
				const icon = files[0];
				const formData = new FormData();
				formData.append('file', icon);
				formData.append('key', cUser.username);

				await fetch('/api/s3', {
					method: 'POST',
					body: formData
				});
			}
			if (Object.values(formData).some((value) => value !== null)) {
				let currProfile = user.profile ?? {};
				let newProfile: Profile = {
					...currProfile,
					...formData
				};
				user.profile = newProfile;
				await updateUser(cUser.id, { profile: newProfile });
			}
		}
		// Toggle edit mode
		isEditing = !isEditing;
	}
</script>

<div class="grid h-full w-full grid-cols-10 grid-rows-5 gap-4">
	<div class="col-span-3 row-span-3 rounded-xl p-4">
		{#if isEditing}
			<!-- 			<FileUpload name="files" bind:files>
				<svelte:fragment slot="lead"><i class="fa-solid fa-file-arrow-up"></i></svelte:fragment>
				<svelte:fragment slot="message">Upload a profile picture</svelte:fragment>
				<svelte:fragment slot="meta">PNG, JPG allowed</svelte:fragment>
			</FileUpload> -->
		{:else}
			<!-- 			<Avatar src={avatarUrl} alt="avatar" width="w-full" rounded="rounded-md" />
 -->
		{/if}
		{#if user.id !== cUser.id}
			<div class="preset-filled-secondary-500 my-4 w-full justify-center">
				<button>Add</button>
				<button>Trade</button>
				<button>DM</button>
			</div>
		{:else}
			<div class="my-4 w-full justify-center">
				<button
					type="button"
					aria-label="Edit"
					class="preset-filled-secondary-500 btn *:pointer-events-none"
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
				<section class="text-l leading-relaxed font-medium">{user.profile.bio}</section>
			{/if}
		</div>
		<div class="card h-1/4 p-4">
			<section class="text-l leading-relaxed font-medium">milestones</section>
		</div>
	</div>
</div>

<div class="card preset-filled-secondary-500 p-4" data-popup="popupHover">
	{#if isEditing}
		<p>Save</p>
	{:else}
		<p>Edit Profile</p>
	{/if}
	<div class="preset-filled-secondary-500 arrow"></div>
</div>
