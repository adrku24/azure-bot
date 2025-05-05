// Local: import adapter from '@sveltejs/adapter-node';
import azure from 'svelte-adapter-azure-swa';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // Local: adapter: adapter()
      adapter: azure()
  },
  preprocess: vitePreprocess()
};

export default config;
