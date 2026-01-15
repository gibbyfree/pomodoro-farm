import { createToaster } from '@skeletonlabs/skeleton-svelte';

export const toaster = createToaster({
    placement: 'bottom',
    overlap: false,
    duration: 4000
});
