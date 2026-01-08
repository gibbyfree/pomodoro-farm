<script lang="ts">
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import {
		CircleUserIcon,
		HouseIcon,
		PawPrintIcon,
		SettingsIcon,
		SproutIcon,
		TractorIcon
	} from '@lucide/svelte';

	const linksSidebar = {
		farm: [
			{ label: 'Crops', href: '#', icon: TractorIcon },
			{ label: 'Barn', href: '#', icon: PawPrintIcon }
		],
		user: [{ label: 'Profile', href: '#', icon: CircleUserIcon }]
	};
</script>

<aside class="border-surface-200-800 flex h-full w-52 flex-col border-r">
	<Navigation layout="sidebar" class="flex h-full flex-col">
		<!-- Header -->
		<Navigation.Header class="flex items-center gap-3 p-4">
			<SproutIcon class="text-primary-500 h-8 w-8 stroke-current" />
			<span class="text-xl font-bold">Pomo Farm</span>
		</Navigation.Header>

		<!-- Content -->
		<Navigation.Content class="flex-1 space-y-8 overflow-y-auto px-4 py-2">
			<!-- Home -->
			<Navigation.Group>
				<Navigation.Menu class="space-y-1">
					<Navigation.TriggerAnchor
						href="/"
						title="Home"
						class="flex items-center gap-2 rounded-lg px-3 py-2"
					>
						<HouseIcon class="h-5 w-5 stroke-current" />
						<Navigation.TriggerText>Home</Navigation.TriggerText>
					</Navigation.TriggerAnchor>
				</Navigation.Menu>
			</Navigation.Group>

			<!-- Dynamic groups -->
			{#each Object.entries(linksSidebar) as [category, links]}
				<Navigation.Group>
					<Navigation.Label
						class="mb-2 px-3 text-xs font-semibold tracking-wider uppercase opacity-60"
					>
						{category}
					</Navigation.Label>
					<Navigation.Menu class="space-y-1">
						{#each links as link (link.label)}
							{@const Icon = link.icon}
							<Navigation.TriggerAnchor
								href={link.href}
								title={link.label}
								aria-label={link.label}
								class="flex items-center gap-2 rounded-lg px-3 py-2"
							>
								<Icon class="h-5 w-5 stroke-current" />
								<Navigation.TriggerText>{link.label}</Navigation.TriggerText>
							</Navigation.TriggerAnchor>
						{/each}
					</Navigation.Menu>
				</Navigation.Group>
			{/each}
		</Navigation.Content>

		<!-- Footer -->
		<Navigation.Footer class="border-surface-200-800 border-t p-4">
			<Navigation.TriggerAnchor
				href="/settings"
				title="Settings"
				aria-label="Settings"
				class="flex items-center gap-2 rounded-lg px-3 py-2"
			>
				<SettingsIcon class="h-5 w-5 stroke-current" />
				<Navigation.TriggerText>Settings</Navigation.TriggerText>
			</Navigation.TriggerAnchor>
		</Navigation.Footer>
	</Navigation>
</aside>
