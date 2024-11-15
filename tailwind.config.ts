
import type { Config } from 'tailwindcss';

import { skeleton, contentPath } from '@skeletonlabs/skeleton/plugin';
import * as themes from '@skeletonlabs/skeleton/themes';

const config = {
	// 2. Opt for dark mode to be handled via the class method
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		contentPath(import.meta.url, 'svelte')
	],
	theme: {
		extend: {},
	},
	plugins: [
        skeleton({
            // NOTE: each theme included will be added to your CSS bundle
            themes: [ themes.cerberus, themes.rose ]
        })
	]
} satisfies Config;

export default config;
						