// vite.config.js

import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite'

/** @type {import('vite').Plugin} */
const viteServerConfig = () => ({
    name: 'add-headers',
    configureServer: (server: any) => {
        server.middlewares.use((req: any, res: any, next: any) => {
            res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
            next();
        });
    }
});

export default defineConfig({
    plugins: [sveltekit(), viteServerConfig(), tailwindcss()]
});