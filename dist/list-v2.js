"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTimelineTweetsV2 = void 0;
const timeline_v2_1 = require("./timeline-v2");
function parseTimelineTweetsV2(timeline) {
    let cursor;
    const tweets = [];
    const instructions = timeline.data?.list?.tweets_timeline?.timeline?.instructions ?? [];
    for (const instruction of instructions) {
        for (const entry of instruction.entries ?? []) {
            if (entry.content?.cursorType === 'Bottom') {
                cursor = entry.content.value;
                continue;
            }
            if (entry.content?.itemContent?.tweet_results?.result?.__typename ===
                'Tweet') {
                const tweetResult = (0, timeline_v2_1.parseResultV2)(entry.content.itemContent.tweet_results.result);
                if (tweetResult.success) {
                    tweets.push(tweetResult.tweet);
                }
            }
        }
    }
    return { tweets: [], next: cursor };
}
exports.parseTimelineTweetsV2 = parseTimelineTweetsV2;
//# sourceMappingURL=list-v2.js.map