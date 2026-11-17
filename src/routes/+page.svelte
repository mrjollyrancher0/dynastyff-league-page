<script>
  import LinearProgress from '@smui/linear-progress';
  import { getNflState, leagueName, getAwards, getLeagueTeamManagers, homepageText, managers, gotoManager, enableBlog, waitForAll } from '$lib/utils/helper';
  import { Transactions, PowerRankings, HomePost } from '$lib/components';
  import { getAvatarFromTeamManagers, getTeamFromTeamManagers } from '$lib/utils/helperFunctions/universalFunctions';
  const nflState = getNflState();
  const podiumsData = getAwards();
  const leagueTeamManagersData = getLeagueTeamManagers();
</script>

<svelte:head>
  <title>{leagueName} | League Command Center</title>
  <meta name="description" content="The official Arnie's Dynasty fantasy football league hub: rankings, champions, matchups and activity." />
</svelte:head>

<div class="command-home">
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-art" aria-hidden="true">
      <div class="retro-sun"></div><div class="horizon"></div><div class="skyline"></div><div class="stadium"></div><div class="floor-grid"></div>
    </div>
    <div class="hero-copy">
      <p class="eyebrow"><span class="live-dot"></span> THE OFFICIAL LEAGUE HQ <span class="line"></span> DYNASTY FOOTBALL</p>
      <h1 id="hero-title">LEGENDS ARE BUILT.<br /><span>DYNASTIES ARE EARNED.</span></h1>
      <p class="hero-description">A legacy is never given. Every matchup, trade, and draft pick matters. Welcome to the home of {leagueName}.</p>
      <div class="hero-buttons"><a class="primary-button" href="/standings">VIEW STANDINGS <span aria-hidden="true">↗</span></a><a class="secondary-button" href="/records">LEAGUE RECORDS <span aria-hidden="true">→</span></a></div>
    </div>
    <div class="hero-season">
      {#await nflState}
        <span class="season-kicker">SEASON STATUS</span><span>SYNCING NFL DATA…</span><LinearProgress indeterminate />
      {:then state}
        <span class="season-kicker">NFL {state.season} // STATUS</span>
        <strong>{state.season_type === 'pre' ? 'PRESEASON' : state.season_type === 'post' ? 'POSTSEASON' : `WEEK ${state.week > 0 ? state.week : 'PRESEASON'}`}</strong>
        <span class="season-sync"><span class="live-dot"></span> SLEEPER CONNECTED</span>
      {:catch error}
        <span class="season-kicker">SEASON STATUS</span><span>UNAVAILABLE</span><small>{error.message}</small>
      {/await}
    </div>
  </section>

  <div class="ticker" aria-label="League information"><span class="ticker-label">THE DYNASTY WIRE</span><span>EVERY WEEK COUNTS <b>✦</b> EVERY ROSTER MATTERS <b>✦</b> ONE CHAMPION <b>✦</b> NO SHORTCUTS</span></div>

  <div class="dashboard-grid">
    <section class="panel rankings-panel" aria-labelledby="rankings-title">
      <div class="panel-heading"><div><span class="panel-index">01 / POWER</span><h2 id="rankings-title">POWER RANKINGS</h2></div><a href="/standings" aria-label="View league standings">FULL TABLE ↗</a></div>
      <div class="panel-content rankings-content"><PowerRankings /></div>
    </section>

    <section class="panel champion-panel" aria-labelledby="champion-title">
      <div class="panel-heading"><div><span class="panel-index">02 / LEGACY</span><h2 id="champion-title">REIGNING CHAMPION</h2></div><span class="heading-symbol">★</span></div>
      <div class="champion-stage">
        {#await waitForAll(podiumsData, leagueTeamManagersData)}
          <p class="status-message">RETRIEVING LEAGUE HISTORY…</p><LinearProgress indeterminate />
        {:then [podiums, leagueTeamManagers]}
          {#if podiums[0]}
            <span class="champion-year">{podiums[0].year} LEAGUE CHAMPION</span>
            <button class="champion-avatar" aria-label="View reigning champion" onclick={() => { if (managers.length) gotoManager({year: podiums[0].year, leagueTeamManagers, rosterID: parseInt(podiums[0].champion)}); }}>
              <img src={getAvatarFromTeamManagers(leagueTeamManagers, podiums[0].champion, podiums[0].year)} alt="Champion team avatar" />
              <img class="champion-laurel" src="/laurel.png" alt="" />
            </button>
            <button class="champion-name" onclick={() => gotoManager({year: podiums[0].year, leagueTeamManagers, rosterID: parseInt(podiums[0].champion)})}>{getTeamFromTeamManagers(leagueTeamManagers, podiums[0].champion, podiums[0].year).name}</button>
            <span class="champion-subtitle">THE TEAM TO BEAT</span>
          {:else}
            <p class="status-message">THE FIRST CHAMPION AWAITS.</p>
          {/if}
        {:catch error}
          <p class="status-message">CHAMPION DATA UNAVAILABLE: {error.message}</p>
        {/await}
      </div>
    </section>

    <section class="panel activity-panel" aria-labelledby="activity-title">
      <div class="panel-heading"><div><span class="panel-index">03 / MOVEMENT</span><h2 id="activity-title">TRANSACTION FEED</h2></div><a href="/trades">ALL ACTIVITY ↗</a></div>
      <div class="panel-content activity-content"><Transactions /></div>
    </section>

    <section class="panel intro-panel" aria-labelledby="intro-title">
      <div class="panel-heading"><div><span class="panel-index">04 / LEAGUE INTEL</span><h2 id="intro-title">THE DYNASTY FILES</h2></div><span class="heading-symbol">↗</span></div>
      <div class="intro-copy">{@html homepageText}</div>
      {#if enableBlog}<div class="home-post"><HomePost /></div>{/if}
    </section>
  </div>
  <div class="bottom-mark"><span>ARNIE'S DYNASTY</span><span>BUILT FOR THE LONG GAME // ESTABLISH YOUR LEGACY</span></div>
</div>

<style>
  .command-home{max-width:1680px;margin:0 auto;padding:0 24px 34px;color:#eef6fa;font-family:Arial,Helvetica,sans-serif}
  .hero{position:relative;overflow:hidden;isolation:isolate;min-height:350px;margin:0 -24px;background:linear-gradient(110deg,#101b2c 0%,#0e2031 50%,#261d30 100%);border-bottom:1px solid #33485a;display:flex;align-items:center;padding:48px max(36px,calc((100vw - 1600px)/2 + 32px)) 40px}
  .hero-art{position:absolute;inset:0;overflow:hidden;z-index:-1;background:radial-gradient(ellipse at 75% 48%,rgba(250,113,55,.2),transparent 40%),linear-gradient(140deg,#0a1729,#12273b 65%,#37202f)}
  .retro-sun{position:absolute;right:15%;top:1%;width:300px;aspect-ratio:1;border-radius:50%;background:linear-gradient(160deg,#ffac72,#fb7549 72%,#e34b66);box-shadow:0 0 90px #f65d5340;opacity:.85}
  .horizon{position:absolute;inset:auto 0 0;height:85px;background:linear-gradient(transparent,#111828)}
  .skyline{position:absolute;right:3%;bottom:65px;width:48%;height:120px;opacity:.75;background:linear-gradient(90deg,transparent 0 7%,#122336 7% 9%,transparent 9% 14%,#132436 14% 19%,transparent 19% 23%,#0b2032 23% 25%,transparent 25% 31%,#0e2032 31% 36%,transparent 36% 42%,#142436 42% 44%,transparent 44% 50%,#111c2c 50% 61%,transparent 61% 67%,#111f30 67% 70%,transparent 70% 78%,#131c2c 78% 85%,transparent 85%)}
  .stadium{position:absolute;right:-4%;bottom:25px;width:52%;height:110px;border-radius:70% 70% 5px 5px/50% 50% 5px 5px;border-top:9px solid #ff7b47;background:repeating-linear-gradient(0deg,transparent 0 11px,rgba(40,194,198,.14) 12px 13px),linear-gradient(#183246,#0c1c2c);box-shadow:0 -4px 20px #ef764758,0 9px 0 #0d1727;transform:skewX(-6deg)}
  .floor-grid{position:absolute;inset:auto -20% -90px;height:155px;opacity:.18;background:linear-gradient(transparent 95%,#26c6c3 96%),linear-gradient(90deg,transparent 95%,#26c6c3 96%);background-size:65px 23px;transform:perspective(120px) rotateX(38deg)}
  .hero-copy{max-width:850px;z-index:2}.eyebrow,.panel-index,.season-kicker,.season-sync,.champion-year,.champion-subtitle,.bottom-mark{font-family:'Roboto Mono',monospace;letter-spacing:.15em;font-size:10px;font-weight:700}.eyebrow{color:#ff9157;display:flex;align-items:center;gap:10px}.live-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#3de0c6;box-shadow:0 0 9px #3de0c6}.line{width:24px;height:1px;background:#ff9157}.hero h1{margin:18px 0 12px;line-height:.98;letter-spacing:-.042em;font-size:clamp(31px,4.3vw,65px);font-weight:950;font-style:italic;text-shadow:0 5px 24px #0b1426}.hero h1 span{color:#ff7941}.hero-description{max-width:530px;font-size:14px;line-height:1.6;color:#cbd6df;margin:0 0 23px}.hero-buttons{display:flex;gap:10px;flex-wrap:wrap}.hero-buttons a{display:inline-flex;align-items:center;gap:24px;padding:13px 18px;border-radius:5px;font-size:11px;letter-spacing:.08em;font-weight:850;text-decoration:none}.primary-button{color:white;background:#ed692e;border:1px solid #ff9b5b;box-shadow:0 4px 20px #ee673845}.secondary-button{color:#e9f3f8;border:1px solid #8195a2;background:#152337bb}
  .hero-season{position:absolute;right:30px;bottom:27px;width:205px;display:flex;flex-direction:column;gap:8px;padding:14px 16px;background:#0b1729d9;border:1px solid #385263;border-top:2px solid #2acac2;backdrop-filter:blur(8px)}.hero-season strong{font-size:24px;font-weight:950;letter-spacing:-.02em}.season-kicker{color:#9baec2}.season-sync{color:#3de0c6;font-size:9px}.season-sync .live-dot{margin-right:6px}
  .ticker{display:flex;align-items:center;gap:22px;min-height:36px;border-bottom:1px solid #273b4e;color:#879cb1;font-family:'Roboto Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.12em;overflow:hidden;white-space:nowrap}.ticker-label{background:#e85c2b;color:white;padding:9px 12px;flex-shrink:0}.ticker b{color:#fa7137;margin:0 14px}
  .dashboard-grid{display:grid;grid-template-columns:1.2fr .9fr 1.2fr;gap:14px;margin:18px 0}.panel{min-width:0;overflow:hidden;position:relative;background:linear-gradient(145deg,#132338,#0e1b2c);border:1px solid #30495d;border-radius:9px;box-shadow:0 8px 22px #02091655,0 0 0 1px #14273a inset}.panel:before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#fa7137,#28bbb8 65%,transparent)}.panel-heading{min-height:64px;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 16px;border-bottom:1px solid #344759}.panel-index{font-size:9px;color:#fa8e5f}.panel-heading h2{font-size:15px;font-weight:900;letter-spacing:.045em;margin:6px 0 0;font-style:italic}.panel-heading a{font-family:'Roboto Mono',monospace;font-size:9px;color:#abd0d7;white-space:nowrap;text-decoration:none;letter-spacing:.04em}.panel-heading a:hover{color:#ff9867}.heading-symbol{font-size:20px;color:#ff8d53}.panel-content{padding:12px 14px}.rankings-content,.activity-content{font-size:12px}.rankings-panel{grid-column:span 1}.champion-panel{grid-column:span 1}.activity-panel{grid-column:span 1}.intro-panel{grid-column:1 / -1}.intro-copy{padding:20px 24px;font-size:13px;line-height:1.65;color:#cbd8e2;columns:2;column-gap:42px}.intro-copy :global(p:first-child){margin-top:0}.intro-copy :global(h1),.intro-copy :global(h2){color:#fff}.home-post{padding:12px 20px;border-top:1px solid #30495d}
  .champion-stage{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:275px;padding:16px 12px 20px;background:radial-gradient(ellipse at 50% 70%,#ff71372b,transparent 56%),repeating-linear-gradient(90deg,transparent 0 26px,#ffffff06 27px 28px)}.champion-year{color:#efb17b}.champion-avatar{position:relative;border:0;background:none;cursor:pointer;width:150px;height:150px;margin:8px 0 2px;display:grid;place-items:center}.champion-avatar>img:first-child{width:89px;height:89px;border-radius:50%;object-fit:cover;border:3px solid #ff9c5c;box-shadow:0 0 25px #fb71363d}.champion-laurel{position:absolute;width:150px;height:150px;object-fit:contain;inset:0;filter:drop-shadow(0 0 8px #ff7c3545)}.champion-name{background:transparent;border:0;color:#fff;font-weight:900;font-size:clamp(17px,2vw,26px);font-style:italic;text-transform:uppercase;text-align:center;cursor:pointer;overflow-wrap:anywhere}.champion-subtitle{color:#ff965d;margin-top:8px}.status-message{font-size:12px;color:#b5c4d1;text-align:center}
  .bottom-mark{display:flex;justify-content:space-between;gap:16px;border-top:1px solid #233b4a;padding:20px 4px;color:#6e899b;font-size:9px}.bottom-mark span:first-child{color:#f2804b}
  @media(max-width:1250px){.dashboard-grid{grid-template-columns:1fr 1fr}.activity-panel{grid-column:1 / -1}.hero-season{right:18px;bottom:18px}.hero-copy{max-width:72%}}
  @media(max-width:760px){.command-home{padding:0 12px 22px}.hero{margin:0 -12px;min-height:420px;padding:38px 22px 122px;align-items:flex-start}.hero-copy{max-width:100%}.hero h1{font-size:clamp(30px,7vw,48px)}.hero-description{max-width:450px}.hero-season{left:22px;right:auto;bottom:17px;width:220px}.retro-sun{width:220px;right:-40px;top:80px;opacity:.4}.stadium{width:90%}.dashboard-grid{grid-template-columns:1fr}.rankings-panel,.champion-panel,.activity-panel,.intro-panel{grid-column:1}.intro-copy{columns:1;padding:16px}.bottom-mark{flex-direction:column}.ticker{font-size:9px}}
  @media(prefers-reduced-motion:reduce){*,*:before,*:after{scroll-behavior:auto!important;animation:none!important;transition:none!important}}
</style>
