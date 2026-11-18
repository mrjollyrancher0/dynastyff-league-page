/**
 * Pure validation helpers for statistics built from Sleeper responses.
 * Kept independent of Svelte so they can be regression-tested with node:test.
 */
export function isFreshRecordCache(cached, now, maxAge) {
	return Boolean(cached?.regularSeasonData && cached?.playoffData &&
		Number.isFinite(cached.generatedAt) &&
		cached.generatedAt <= now && now - cached.generatedAt < maxAge);
}

export function isUsableWeeklyScore(matchup) {
	if (!matchup || matchup.points == null) return false;
	const score = Number(matchup.points);
	if (!Number.isFinite(score) || score < 0) return false;
	// A zero without lineup evidence normally denotes an unplayed Sleeper matchup.
	return score !== 0 || Array.isArray(matchup.starters_points) || Boolean(matchup.m);
}

export function getChampionshipEntrants(bracket) {
	const entrants = new Set();
	for (const round of bracket || []) {
		for (const pairing of round || []) {
			for (const team of pairing || []) {
				if (team?.roster_id != null) entrants.add(String(team.roster_id));
			}
		}
	}
	return entrants;
}

/**
 * Return null for future/incomplete playoff matchups. A legitimate scored zero
 * remains valid when a lineup's starters_points array is present.
 */
export function sumCompletedPlayoffPoints(pointsByWeek) {
	if (!pointsByWeek || typeof pointsByWeek !== 'object') return null;
	const weeks = Object.values(pointsByWeek);
	if (!weeks.length) return null;
	let total = 0;
	for (const values of weeks) {
		if (!Array.isArray(values) || values.length === 0) return null;
		for (const value of values) {
			if (typeof value !== 'number' || !Number.isFinite(value)) return null;
			total += value;
		}
	}
	return total;
}
