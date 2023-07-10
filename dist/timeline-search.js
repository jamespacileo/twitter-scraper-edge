"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSearchTimelineUsers = exports.parseSearchTimelineTweets = void 0;
const profile_1 = require("./profile");
const timeline_v2_1 = require("./timeline-v2");
function parseSearchTimelineTweets(timeline) {
    let cursor;
    const tweets = [];
    const instructions = timeline.data?.search_by_raw_query?.search_timeline?.timeline
        ?.instructions ?? [];
    for (const instruction of instructions) {
        if (instruction.type === 'TimelineAddEntries' ||
            instruction.type === 'TimelineReplaceEntry') {
            if (instruction.entry?.content?.cursorType === 'Bottom') {
                cursor = instruction.entry.content.value;
                continue;
            }
            for (const entry of instruction.entries ?? []) {
                const itemContent = entry.content?.itemContent;
                if (itemContent?.tweetDisplayType === 'Tweet') {
                    const tweetResultRaw = itemContent.tweet_results?.result;
                    const tweetResult = (0, timeline_v2_1.parseLegacyTweet)(tweetResultRaw?.core?.user_results?.result?.legacy, tweetResultRaw?.legacy);
                    if (tweetResult.success) {
                        if (!tweetResult.tweet.views && tweetResultRaw?.views?.count) {
                            const views = parseInt(tweetResultRaw.views.count);
                            if (!isNaN(views)) {
                                tweetResult.tweet.views = views;
                            }
                        }
                        tweets.push(tweetResult.tweet);
                    }
                }
                else if (entry.content?.cursorType === 'Bottom') {
                    cursor = entry.content.value;
                }
            }
        }
    }
    return { tweets, next: cursor };
}
exports.parseSearchTimelineTweets = parseSearchTimelineTweets;
function parseSearchTimelineUsers(timeline) {
    let cursor;
    const profiles = [];
    const instructions = timeline.data?.search_by_raw_query?.search_timeline?.timeline
        ?.instructions ?? [];
    for (const instruction of instructions) {
        if (instruction.type === 'TimelineAddEntries' ||
            instruction.type === 'TimelineReplaceEntry') {
            if (instruction.entry?.content?.cursorType === 'Bottom') {
                cursor = instruction.entry.content.value;
                continue;
            }
            for (const entry of instruction.entries ?? []) {
                const itemContent = entry.content?.itemContent;
                if (itemContent?.userDisplayType === 'User') {
                    const userResultRaw = itemContent.user_results?.result;
                    if (userResultRaw?.legacy) {
                        const profile = (0, profile_1.parseProfile)(userResultRaw.legacy);
                        if (!profile.userId) {
                            profile.userId = itemContent.user_results?.result?.rest_id;
                        }
                        profiles.push(profile);
                    }
                }
                else if (entry.content?.cursorType === 'Bottom') {
                    cursor = entry.content.value;
                }
            }
        }
    }
    return { profiles, next: cursor };
}
exports.parseSearchTimelineUsers = parseSearchTimelineUsers;
//# sourceMappingURL=timeline-search.js.map