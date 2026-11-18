import test from 'node:test';
import assert from 'node:assert/strict';
import {
	isFreshRecordCache,
	isUsableWeeklyScore,
	getChampionshipEntrants,
	sumCompletedPlayoffPoints
} from '../src/lib/utils/helperFunctions/recordsIntegrity.js';

test('records cache must be complete, current and timestamped', () => {
	const now = 1_000_000;
	const valid = { regularSeasonData: {}, playoffData: {}, generatedAt: now - 10_000 };
	assert.equal(isFreshRecordCache(valid, now, 900_000), true);
	assert.equal(isFreshRecordCache({ ...valid, generatedAt: now - 900_000 }, now, 900_000), false);
	assert.equal(isFreshRecordCache({ ...valid, generatedAt: now + 500 }, now, 900_000), false);
	assert.equal(isFreshRecordCache({ ...valid, playoffData: null }, now, 900_000), false);
	assert.equal(isFreshRecordCache({ regularSeasonData: {}, playoffData: {} }, now, 900_000), false);
});

test('weekly record validation accepts scored games and discards missing scores', () => {
	assert.equal(isUsableWeeklyScore({ points: 216.58, roster_id: 1 }), true);
	assert.equal(isUsableWeeklyScore({ points: '193.12', roster_id: 12 }), true);
	assert.equal(isUsableWeeklyScore({ points: 0, starters_points: [0, 0] }), true);
	assert.equal(isUsableWeeklyScore({ points: 0 }), false);
	assert.equal(isUsableWeeklyScore({ points: null }), false);
	assert.equal(isUsableWeeklyScore({ points: 'NaN' }), false);
	assert.equal(isUsableWeeklyScore({ points: -1 }), false);
});

test('championship entrants exclude teams only in consolation bracket', () => {
	const championship = [
		[[{ roster_id: 1 }, { roster_id: 4 }], [{ roster_id: 2 }, { roster_id: 3 }]],
		[[{ roster_id: 1 }, { roster_id: 2 }]]
	];
	assert.deepEqual([...getChampionshipEntrants(championship)].sort(), ['1', '2', '3', '4']);
	assert.equal(getChampionshipEntrants(championship).has('11'), false);
});

test('playoff scoring rejects future brackets and preserves scored zero', () => {
	assert.equal(sumCompletedPlayoffPoints({ 1: [18.5, 22, 4.7], 2: [8, 0] }), 53.2);
	assert.equal(sumCompletedPlayoffPoints({ 1: [0, 0] }), 0);
	assert.equal(sumCompletedPlayoffPoints({ 1: undefined }), null);
	assert.equal(sumCompletedPlayoffPoints({ 1: [] }), null);
	assert.equal(sumCompletedPlayoffPoints({ 1: [NaN] }), null);
	assert.equal(sumCompletedPlayoffPoints({}), null);
});
