"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTweetTimeline = exports.getUserTimeline = void 0;
async function* getUserTimeline(query, maxProfiles, fetchFunc) {
    let nProfiles = 0;
    let cursor = undefined;
    while (nProfiles < maxProfiles) {
        const batch = await fetchFunc(query, maxProfiles, cursor);
        const { profiles, next } = batch;
        if (profiles.length === 0) {
            break;
        }
        for (const profile of profiles) {
            if (nProfiles < maxProfiles) {
                cursor = next;
                yield profile;
            }
            else {
                break;
            }
            nProfiles++;
        }
    }
}
exports.getUserTimeline = getUserTimeline;
async function* getTweetTimeline(query, maxTweets, fetchFunc) {
    let nTweets = 0;
    let cursor = undefined;
    while (nTweets < maxTweets) {
        const batch = await fetchFunc(query, maxTweets, cursor);
        const { tweets, next } = batch;
        if (tweets.length === 0) {
            break;
        }
        for (const tweet of tweets) {
            if (nTweets < maxTweets) {
                cursor = next;
                yield tweet;
            }
            else {
                break;
            }
            nTweets++;
        }
    }
}
exports.getTweetTimeline = getTweetTimeline;
//# sourceMappingURL=timeline-async.js.map