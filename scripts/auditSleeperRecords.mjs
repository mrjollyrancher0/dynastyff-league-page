/**
 * Independent source-data audit. Does not import any production record logic.
 * Usage: node scripts/auditSleeperRecords.mjs [leagueId]
 */
const rootLeagueId = process.argv[2] || '1312958747974303744';
const api = 'https://api.sleeper.app/v1';
async function request(path) {
	const response = await fetch(api + path, { signal: AbortSignal.timeout(20000) });
	if (!response.ok) throw new Error(path + ' returned HTTP ' + response.status);
	return response.json();
}
const seasons = [];
const scores = [];
const visits = new Set();
const nfl = await request('/state/nfl');
let leagueId = rootLeagueId;
while (leagueId && leagueId !== '0') {
	if (visits.has(leagueId)) throw new Error('Circular history link: ' + leagueId);
	visits.add(leagueId);
	const league = await request('/league/' + leagueId);
	if (!league?.settings?.playoff_week_start || !league.season) {
		throw new Error('Missing league settings for ' + leagueId);
	}
	const year = Number(league.season);
	const regularWeeks = Number(league.settings.playoff_week_start) - 1;
	const completedWeeks = league.status === 'complete' || String(year) < String(nfl.season)
		? regularWeeks : String(year) === String(nfl.season)
			? nfl.season_type === 'regular'
				? Math.max(0, Math.min(regularWeeks, Number(nfl.week) - 1))
				: regularWeeks
			: 0;
	const weeks = await Promise.all(Array.from({ length: completedWeeks }, (_, i) =>
		request('/league/' + leagueId + '/matchups/' + (i + 1))));
	const rosters = await request('/league/' + leagueId + '/rosters');
	const users = await request('/league/' + leagueId + '/users');
	const rosterMap = new Map(rosters.map(r => [r.roster_id, r]));
	const usersMap = new Map(users.map(u => [u.user_id, u]));
	let entries = 0;
	for (let i = 0; i < weeks.length; i++) {
		if (!Array.isArray(weeks[i])) throw new Error('Invalid matchup data: ' + year + ' week ' + (i + 1));
		for (const game of weeks[i]) {
			const points = game.points;
			if (game.roster_id == null || points == null || !Number.isFinite(Number(points))) continue;
			if (Number(points) < 0) continue;
			const roster = rosterMap.get(game.roster_id);
			const user = usersMap.get(roster?.owner_id);
			scores.push({
				year, week: i + 1, rosterId: game.roster_id, points: Number(points),
				manager: user?.display_name || roster?.owner_id || 'Unknown',
				team: user?.metadata?.team_name || user?.display_name || 'Unknown',
				leagueId
			});
			entries++;
		}
	}
	seasons.push({ year, leagueId, completedWeeks, entries, totalRosters: rosters.length, status: league.status });
	leagueId = league.previous_league_id ? String(league.previous_league_id) : null;
}
scores.sort((a, b) => b.points - a.points);
console.log('SEASONS:');
console.log(JSON.stringify(seasons, null, 2));
console.log('TOP 20 SINGLE-GAME REGULAR-SEASON SCORES:');
console.log(JSON.stringify(scores.slice(0, 20), null, 2));
console.log('HISTORY COVERAGE: ' + seasons.length + ' seasons, ' + scores.length + ' recorded team-weeks');
if (!scores.length) throw new Error('No scored matchups found in league history.');
