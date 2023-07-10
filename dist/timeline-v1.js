"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUsers = exports.parseTimelineTweetsV1 = void 0;
const profile_1 = require("./profile");
const timeline_tweet_util_1 = require("./timeline-tweet-util");
const type_util_1 = require("./type-util");
function parseTimelineTweet(timeline, id) {
    const tweets = timeline.globalObjects?.tweets ?? {};
    const tweet = tweets[id];
    if (tweet?.user_id_str == null) {
        return {
            success: false,
            err: new Error(`Tweet "${id}" was not found in the timeline object.`),
        };
    }
    const users = timeline.globalObjects?.users ?? {};
    const user = users[tweet.user_id_str];
    if (user?.screen_name == null) {
        return {
            success: false,
            err: new Error(`User "${tweet.user_id_str}" has no username data.`),
        };
    }
    const hashtags = tweet.entities?.hashtags ?? [];
    const mentions = tweet.entities?.user_mentions ?? [];
    const media = tweet.extended_entities?.media ?? [];
    const pinnedTweets = new Set(user.pinned_tweet_ids_str ?? []);
    const urls = tweet.entities?.urls ?? [];
    const { photos, videos, sensitiveContent } = (0, timeline_tweet_util_1.parseMediaGroups)(media);
    const tw = {
        conversationId: tweet.conversation_id_str,
        id,
        hashtags: hashtags
            .filter((0, type_util_1.isFieldDefined)('text'))
            .map((hashtag) => hashtag.text),
        likes: tweet.favorite_count,
        mentions: mentions.filter((0, type_util_1.isFieldDefined)('id_str')).map((mention) => ({
            id: mention.id_str,
            username: mention.screen_name,
            name: mention.name,
        })),
        name: user.name,
        permanentUrl: `https://twitter.com/${user.screen_name}/status/${id}`,
        photos,
        replies: tweet.reply_count,
        retweets: tweet.retweet_count,
        text: tweet.full_text,
        thread: [],
        urls: urls
            .filter((0, type_util_1.isFieldDefined)('expanded_url'))
            .map((url) => url.expanded_url),
        userId: tweet.user_id_str,
        username: user.screen_name,
        videos,
    };
    if (tweet.created_at) {
        tw.timeParsed = new Date(Date.parse(tweet.created_at));
        tw.timestamp = Math.floor(tw.timeParsed.valueOf() / 1000);
    }
    if (tweet.place?.id) {
        tw.place = tweet.place;
    }
    if (tweet.quoted_status_id_str) {
        tw.isQuoted = true;
        tw.quotedStatusId = tweet.quoted_status_id_str;
        const quotedStatusResult = parseTimelineTweet(timeline, tweet.quoted_status_id_str);
        if (quotedStatusResult.success) {
            tw.quotedStatus = quotedStatusResult.tweet;
        }
    }
    if (tweet.in_reply_to_status_id_str) {
        tw.isReply = true;
        tw.inReplyToStatusId = tweet.in_reply_to_status_id_str;
        const replyStatusResult = parseTimelineTweet(timeline, tweet.in_reply_to_status_id_str);
        if (replyStatusResult.success) {
            tw.inReplyToStatus = replyStatusResult.tweet;
        }
    }
    if (tweet.retweeted_status_id_str != null) {
        tw.isRetweet = true;
        tw.retweetedStatusId = tweet.retweeted_status_id_str;
        const retweetedStatusResult = parseTimelineTweet(timeline, tweet.retweeted_status_id_str);
        if (retweetedStatusResult.success) {
            tw.retweetedStatus = retweetedStatusResult.tweet;
        }
    }
    const views = parseInt(tweet.ext_views?.count ?? '');
    if (!isNaN(views)) {
        tw.views = views;
    }
    if (pinnedTweets.has(tweet.id_str)) {
        // TODO: Update tests so this can be assigned at the tweet declaration
        tw.isPin = true;
    }
    if (sensitiveContent) {
        // TODO: Update tests so this can be assigned at the tweet declaration
        tw.sensitiveContent = true;
    }
    tw.html = (0, timeline_tweet_util_1.reconstructTweetHtml)(tweet, tw.photos, tw.videos);
    return { success: true, tweet: tw };
}
function parseTimelineTweetsV1(timeline) {
    let cursor;
    let pinnedTweet;
    let orderedTweets = [];
    for (const instruction of timeline.timeline?.instructions ?? []) {
        const { pinEntry, addEntries, replaceEntry } = instruction;
        // Handle pin instruction
        const pinnedTweetId = pinEntry?.entry?.content?.item?.content?.tweet?.id;
        if (pinnedTweetId != null) {
            const tweetResult = parseTimelineTweet(timeline, pinnedTweetId);
            if (tweetResult.success) {
                pinnedTweet = tweetResult.tweet;
            }
        }
        // Handle add instructions
        for (const { content } of addEntries?.entries ?? []) {
            const tweetId = content?.item?.content?.tweet?.id;
            if (tweetId != null) {
                const tweetResult = parseTimelineTweet(timeline, tweetId);
                if (tweetResult.success) {
                    orderedTweets.push(tweetResult.tweet);
                }
            }
            const operation = content?.operation;
            if (operation?.cursor?.cursorType === 'Bottom') {
                cursor = operation?.cursor?.value;
            }
        }
        // Handle replace instruction
        const operation = replaceEntry?.entry?.content?.operation;
        if (operation?.cursor?.cursorType === 'Bottom') {
            cursor = operation.cursor.value;
        }
    }
    if (pinnedTweet != null && orderedTweets.length > 0) {
        orderedTweets = [pinnedTweet, ...orderedTweets];
    }
    return {
        tweets: orderedTweets,
        next: cursor,
    };
}
exports.parseTimelineTweetsV1 = parseTimelineTweetsV1;
function parseUsers(timeline) {
    const users = new Map();
    const userObjects = timeline.globalObjects?.users ?? {};
    for (const id in userObjects) {
        const legacy = userObjects[id];
        if (legacy == null) {
            continue;
        }
        const user = (0, profile_1.parseProfile)(legacy);
        users.set(id, user);
    }
    let cursor;
    const orderedProfiles = [];
    for (const instruction of timeline.timeline?.instructions ?? []) {
        for (const entry of instruction.addEntries?.entries ?? []) {
            const userId = entry.content?.item?.content?.user?.id;
            const profile = users.get(userId);
            if (profile != null) {
                orderedProfiles.push(profile);
            }
            const operation = entry.content?.operation;
            if (operation?.cursor?.cursorType === 'Bottom') {
                cursor = operation?.cursor?.value;
            }
        }
        const operation = instruction.replaceEntry?.entry?.content?.operation;
        if (operation?.cursor?.cursorType === 'Bottom') {
            cursor = operation.cursor.value;
        }
    }
    return {
        profiles: orderedProfiles,
        next: cursor,
    };
}
exports.parseUsers = parseUsers;
//# sourceMappingURL=timeline-v1.js.map