"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTweet = exports.getLatestTweet = exports.getTweetsByUserId = exports.getTweets = exports.fetchTweets = void 0;
const api_1 = require("./api");
const profile_1 = require("./profile");
const timeline_v2_1 = require("./timeline-v2");
const timeline_async_1 = require("./timeline-async");
const json_stable_stringify_1 = __importDefault(require("json-stable-stringify"));
async function fetchTweets(userId, maxTweets, cursor, auth) {
    if (maxTweets > 200) {
        maxTweets = 200;
    }
    const variables = {
        userId,
        count: maxTweets,
        includePromotedContent: false,
        withQuickPromoteEligibilityTweetFields: false,
        withVoice: true,
        withV2Timeline: true,
    };
    const features = (0, api_1.addApiFeatures)({
        interactive_text_enabled: true,
        longform_notetweets_inline_media_enabled: false,
        responsive_web_text_conversations_enabled: false,
        tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: false,
        vibe_api_enabled: true,
    });
    if (cursor != null && cursor != '') {
        variables['cursor'] = cursor;
    }
    const params = new URLSearchParams();
    params.set('variables', (0, json_stable_stringify_1.default)(variables));
    params.set('features', (0, json_stable_stringify_1.default)(features));
    const res = await (0, api_1.requestApi)(`https://twitter.com/i/api/graphql/UGi7tjRPr-d_U3bCPIko5Q/UserTweets?${params.toString()}`, auth);
    if (!res.success) {
        throw res.err;
    }
    return (0, timeline_v2_1.parseTimelineTweetsV2)(res.value);
}
exports.fetchTweets = fetchTweets;
function getTweets(user, maxTweets, auth) {
    return (0, timeline_async_1.getTweetTimeline)(user, maxTweets, async (q, mt, c) => {
        const userIdRes = await (0, profile_1.getUserIdByScreenName)(q, auth);
        if (!userIdRes.success) {
            throw userIdRes.err;
        }
        const { value: userId } = userIdRes;
        return fetchTweets(userId, mt, c, auth);
    });
}
exports.getTweets = getTweets;
function getTweetsByUserId(userId, maxTweets, auth) {
    return (0, timeline_async_1.getTweetTimeline)(userId, maxTweets, (q, mt, c) => {
        return fetchTweets(q, mt, c, auth);
    });
}
exports.getTweetsByUserId = getTweetsByUserId;
async function getLatestTweet(user, includeRetweets, auth) {
    const max = includeRetweets ? 1 : 200;
    const timeline = getTweets(user, max, auth);
    if (max == 1) {
        return (await timeline.next()).value;
    }
    for await (const tweet of timeline) {
        if (!tweet.isRetweet) {
            return tweet;
        }
    }
    return null;
}
exports.getLatestTweet = getLatestTweet;
async function getTweet(id, auth) {
    const variables = {
        focalTweetId: id,
        with_rux_injections: false,
        includePromotedContent: true,
        withCommunity: true,
        withQuickPromoteEligibilityTweetFields: true,
        withBirdwatchNotes: true,
        withVoice: true,
        withV2Timeline: true,
    };
    const features = (0, api_1.addApiFeatures)({
        longform_notetweets_inline_media_enabled: true,
        tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: false,
    });
    const params = new URLSearchParams();
    params.set('features', (0, json_stable_stringify_1.default)(features));
    params.set('variables', (0, json_stable_stringify_1.default)(variables));
    const res = await (0, api_1.requestApi)(`https://twitter.com/i/api/graphql/VWFGPVAGkZMGRKGe3GFFnA/TweetDetail?${params.toString()}`, auth);
    if (!res.success) {
        throw res.err;
    }
    const tweets = (0, timeline_v2_1.parseThreadedConversation)(res.value);
    for (const tweet of tweets) {
        if (tweet.id === id) {
            return tweet;
        }
    }
    return null;
}
exports.getTweet = getTweet;
//# sourceMappingURL=tweets.js.map