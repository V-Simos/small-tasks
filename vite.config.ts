import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		rollupOptions: {
		  input: {
			app: './index.html',
			'service-worker': './lib/service-worker.ts',
		  },
		},
	  },
});
