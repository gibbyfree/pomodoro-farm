<script lang="ts">
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';

	interface Props {
		open: boolean;
		onSubmit: (username: string) => void;
		onOpenChange?: (open: boolean) => void;
	}

	let { open = $bindable(), onSubmit, onOpenChange }: Props = $props();

	let username = $state('');

	function handleSubmit() {
		if (username.trim()) {
			onSubmit(username.trim());
			username = '';
			open = false;
		}
	}

	function handleOpenChange(details: { open: boolean }) {
		open = details.open;
		onOpenChange?.(details.open);
	}
</script>

<Dialog {open} onOpenChange={handleOpenChange} closeOnInteractOutside={false}>
	<Portal>
		<Dialog.Backdrop class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center p-4">
			<Dialog.Content
				class="card preset-filled-surface-100-900 w-full max-w-md space-y-4 rounded-xl p-6 shadow-2xl"
			>
				<Dialog.Title class="text-2xl font-bold">
					Howdy, stranger! What should we call you?
				</Dialog.Title>
				<Dialog.Description class="opacity-70">
					Choose a username for your farm. This can't be changed later!
				</Dialog.Description>

				<form
					class="space-y-4"
					onsubmit={(e) => {
						e.preventDefault();
						handleSubmit();
					}}
				>
					<label class="label">
						<span class="label-text">Username</span>
						<input
							class="input"
							type="text"
							bind:value={username}
							placeholder="Enter your farmer name..."
							required
							minlength="3"
							maxlength="20"
						/>
					</label>

					<footer class="flex justify-end gap-2 pt-4">
						<Dialog.CloseTrigger class="btn preset-tonal">Cancel</Dialog.CloseTrigger>
						<button type="submit" class="btn preset-filled" disabled={!username.trim()}>
							<span><i class="fa-solid fa-check"></i></span>
							<span>Register</span>
						</button>
					</footer>
				</form>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
