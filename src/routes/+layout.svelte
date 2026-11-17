<!-- __layout.svelte -->
<script>
  import CommandNav from '$lib/components/CommandNav.svelte';
  import { Footer } from '$lib/components';
  import { dev } from '$app/environment';
  import { injectAnalytics } from '@vercel/analytics/sveltekit';
  import './command-center.css';
  injectAnalytics({ mode: dev ? 'development' : 'production' });
</script>

<CommandNav />
<main class="command-layout"><slot /></main>
<Footer />
