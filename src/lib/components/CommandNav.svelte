<script>
  import { page } from '$app/stores';
  import { leagueName } from '$lib/utils/helper';
  let menuOpen = false;
  const links = [
    { label: 'Home', href: '/' },
    { label: 'Matchups', href: '/matchups' },
    { label: 'Standings', href: '/standings' },
    { label: 'Rosters', href: '/rosters' },
    { label: 'Drafts', href: '/drafts' },
    { label: 'Records', href: '/records' },
    { label: 'Trades', href: '/transactions?show=trade&query=&page=1' }
  ];
</script>

<svelte:head>
  <meta name="theme-color" content="#080f1e" />
</svelte:head>

<header class="command-header">
  <div class="command-header__inner">
    <a href="/" class="brand" aria-label={`${leagueName} home`} onclick={() => menuOpen = false}>
      <span class="brand__sun" aria-hidden="true"><span></span></span>
      <span class="brand__type"><strong>ARNIE'S</strong><em>DYNASTY</em></span>
    </a>
    <button class="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onclick={() => menuOpen = !menuOpen}>
      <span></span><span></span><span></span>
    </button>
    <nav class:open={menuOpen} aria-label="Main navigation">
      {#each links as link}
        <a class:current={$page.url.pathname === link.href} href={link.href} aria-current={$page.url.pathname === link.href ? 'page' : undefined} onclick={() => menuOpen = false}>{link.label}</a>
      {/each}
    </nav>
    <a class="header-action" href="/standings">SEASON HUB <span aria-hidden="true">↗</span></a>
  </div>
</header>

<style>
  .command-header{position:sticky;top:0;z-index:100;background:rgba(7,14,27,.94);border-bottom:1px solid rgba(112,168,190,.2);backdrop-filter:blur(16px)}
  .command-header__inner{max-width:1600px;min-height:72px;margin:auto;padding:0 28px;display:flex;align-items:center;gap:30px}
  .brand{display:flex;align-items:center;gap:12px;text-decoration:none;flex-shrink:0}
  .brand__sun{position:relative;width:51px;height:42px;overflow:hidden;display:block;border-bottom:3px solid #f35d26}
  .brand__sun:before{content:'';position:absolute;left:7px;top:0;width:38px;height:38px;border-radius:50%;background:linear-gradient(155deg,#ffae65,#f0662d)}
  .brand__sun:after{content:'';position:absolute;left:0;bottom:8px;width:51px;height:3px;background:#0a1120;box-shadow:0 -9px #0a1120}
  .brand__sun span{position:absolute;bottom:0;left:0;width:51px;height:2px;background:#f35d26}
  .brand__type{display:grid;line-height:.9;letter-spacing:.035em;transform:skew(-8deg);font-family:Arial,sans-serif;font-weight:900;font-size:20px}
  .brand__type strong{color:#f8f8fa}.brand__type em{font-style:normal;color:#ff713a}
  nav{display:flex;align-items:stretch;justify-content:center;gap:2px;flex:1;height:72px}
  nav a{position:relative;display:flex;align-items:center;padding:0 13px;color:#c4d0dc;font-size:12px;font-weight:750;letter-spacing:.09em;text-decoration:none;text-transform:uppercase;white-space:nowrap}
  nav a:hover,nav a.current{color:#fff}
  nav a.current:after,nav a:hover:after{content:'';position:absolute;left:13px;right:13px;bottom:0;height:3px;background:#ff713a;box-shadow:0 0 15px rgba(255,113,58,.55)}
  .header-action{white-space:nowrap;padding:12px 16px;border:1px solid #ff864a;background:linear-gradient(120deg,#e45521,#fc853e);color:#fff;font-weight:900;font-size:12px;letter-spacing:.07em;text-decoration:none;border-radius:7px}
  .header-action span{margin-left:8px}.menu-toggle{display:none}
  @media(max-width:1100px){.command-header__inner{gap:14px;padding:0 18px}.brand__type{font-size:17px}nav a{padding:0 8px;font-size:11px}}
  @media(max-width:830px){.command-header__inner{min-height:66px;justify-content:space-between}.menu-toggle{display:flex;flex-direction:column;justify-content:space-around;width:40px;height:38px;background:none;border:1px solid #334358;border-radius:5px;padding:8px;order:3}.menu-toggle span{height:2px;background:#fff;width:100%}.header-action{margin-left:auto}.command-header nav{display:none;position:absolute;top:66px;left:0;right:0;height:auto;padding:10px 18px 20px;flex-direction:column;background:#0b1525;border-bottom:1px solid #34475a}.command-header nav.open{display:flex}.command-header nav a{min-height:44px;padding:0 12px}.command-header nav a.current:after,.command-header nav a:hover:after{left:0;right:auto;top:10px;bottom:10px;width:3px;height:auto}}
  @media(max-width:420px){.brand__type{font-size:15px}.header-action{padding:10px;font-size:10px}.brand__sun{width:38px}}
</style>
