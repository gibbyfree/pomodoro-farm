<script lang="ts">
	import type { PageData } from './$types';
	import { Avatar, FileUpload, Tooltip, Portal } from '@skeletonlabs/skeleton-svelte';
	import { FileIcon } from '@lucide/svelte';
	import { cUser } from '$lib/state/user.svelte';
	import type { Profile } from '$lib/types';
	import { updateUser } from '$lib/user';

	let { data }: { data: PageData } = $props();
	let user = data.user ?? { id: 'loading', username: 'loading', profile: null };

	let isEditing = $state(false);

	let uploadedFiles: File[] = $state([]);
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
			if (uploadedFiles.length > 0) {
				const icon = uploadedFiles[0];
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
	<div class="card preset-filled-surface-100-900 col-span-3 row-span-3 p-4">
		{#if isEditing}
			<FileUpload
				accept="image/png, image/jpeg"
				maxFiles={1}
				onFileChange={(details) => (uploadedFiles = details.acceptedFiles)}
			>
				<FileUpload.Dropzone class="flex flex-col items-center gap-2 p-6">
					<FileIcon class="size-10 opacity-50" />
					<span>Upload a profile picture</span>
					<span class="text-sm opacity-60">PNG, JPG allowed</span>
					<FileUpload.Trigger class="btn preset-filled-primary-500">Browse Files</FileUpload.Trigger
					>
					<FileUpload.HiddenInput />
				</FileUpload.Dropzone>
				<FileUpload.ItemGroup class="mt-2">
					<FileUpload.Context>
						{#snippet children(fileUpload)}
							{#each fileUpload().acceptedFiles as file (file.name)}
								<FileUpload.Item
									{file}
									class="card preset-filled-surface-100-900 flex items-center justify-between gap-2 p-2"
								>
									<FileUpload.ItemName class="truncate">{file.name}</FileUpload.ItemName>
									<FileUpload.ItemDeleteTrigger class="btn-icon preset-tonal" />
								</FileUpload.Item>
							{/each}
						{/snippet}
					</FileUpload.Context>
				</FileUpload.ItemGroup>
			</FileUpload>
		{:else}
			<Avatar class="w-full">
				<Avatar.Image src={avatarUrl} alt="avatar" />
				<Avatar.Fallback>PF</Avatar.Fallback>
			</Avatar>
		{/if}
		{#if user.id !== cUser.id}
			<footer class="mt-4 flex w-full justify-center gap-2">
				<button class="btn preset-filled">Add</button>
				<button class="btn preset-filled">Trade</button>
				<button class="btn preset-filled">DM</button>
			</footer>
		{:else}
			<footer class="mt-4 flex w-full justify-center">
				<Tooltip positioning={{ placement: 'bottom' }} openDelay={200}>
					<Tooltip.Trigger
						class="btn preset-filled-secondary-500 *:pointer-events-none"
						onclick={() => handleProfileEdit()}
					>
						{#if isEditing}
							<i class="fa-solid fa-check"></i>
						{:else}
							<i class="fa-solid fa-pencil"></i>
						{/if}
					</Tooltip.Trigger>
					<Portal>
						<Tooltip.Positioner>
							<Tooltip.Content class="card preset-filled-secondary-500 px-3 py-2 text-sm shadow-lg">
								{#if isEditing}
									Save
								{:else}
									Edit Profile
								{/if}
								<Tooltip.Arrow>
									<Tooltip.ArrowTip class="preset-filled-secondary-500" />
								</Tooltip.Arrow>
							</Tooltip.Content>
						</Tooltip.Positioner>
					</Portal>
				</Tooltip>
			</footer>
		{/if}
	</div>
	<div class="col-span-7 col-start-4 row-span-3 space-y-4">
		<header>
			<h2 class="h2 text-3xl font-extrabold md:text-5xl">
				🎃 {user.username}
			</h2>
		</header>
		<article class="card preset-filled-surface-100-900 h-3/4 p-4">
			{#if isEditing}
				<textarea bind:value={formData.bio} class="textarea" rows="8" placeholder={user.profile.bio}
				></textarea>
			{:else}
				<p class="text-l leading-relaxed font-medium">{user.profile.bio}</p>
			{/if}
		</article>
		<article class="card preset-filled-surface-100-900 h-1/4 p-4">
			<h3 class="h3 mb-2">Milestones</h3>
			<p class="text-l leading-relaxed font-medium opacity-60">Coming soon...</p>
		</article>
	</div>
</div>
