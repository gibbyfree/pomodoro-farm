<script lang="ts">
	import type { PageData } from './$types';
	import { PUBLIC_SUPABASE_URL } from '$env/static/public';
	import { Avatar } from '@skeletonlabs/skeleton';

	let { data }: { data: PageData } = $props();
	let user = data.user ?? { id: 'loading', username: 'loading' };

	const avatarUrl = `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/bluebear2.jpg`;
</script>

<div class="grid h-full w-full grid-cols-10 grid-rows-5 gap-4">
	<div class="col-span-3 row-span-3 rounded-xl p-4">
		<Avatar src={avatarUrl} alt="avatar" width="w-full" rounded="rounded-md" />
		<div class="variant-filled-secondary btn-group my-4 w-full justify-center">
			<button>Add</button>
			<button>Trade</button>
			<button>DM</button>
		</div>
	</div>
	<div class="col-span-7 col-start-4 row-span-3 rounded-xl">
		<h2 class="h2 mb-2 text-3xl font-extrabold md:text-5xl">
			{user.username}
		</h2>
		<div class="card mb-2 h-3/4 p-4">
			<section class="text-l font-medium leading-relaxed">i shrimply love to farm</section>
		</div>
		<div class="card h-1/4 p-4">
			<section class="text-l font-medium leading-relaxed">milestones</section>
		</div>
	</div>
</div>
