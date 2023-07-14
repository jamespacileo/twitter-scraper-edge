"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSearchProfiles = exports.fetchListTweets = exports.fetchSearchTweets = exports.searchProfiles = exports.searchTweets = exports.SearchMode = void 0;
const api_1 = require("./api");
const timeline_async_1 = require("./timeline-async");
const timeline_search_1 = require("./timeline-search");
const json_stable_stringify_1 = __importDefault(require("json-stable-stringify"));
const timeline_search_list_1 = require("./timeline-search-list");
/**
 * The categories that can be used in Twitter searches.
 */
var SearchMode;
(function (SearchMode) {
    SearchMode[SearchMode["Top"] = 0] = "Top";
    SearchMode[SearchMode["Latest"] = 1] = "Latest";
    SearchMode[SearchMode["Photos"] = 2] = "Photos";
    SearchMode[SearchMode["Videos"] = 3] = "Videos";
    SearchMode[SearchMode["Users"] = 4] = "Users";
})(SearchMode = exports.SearchMode || (exports.SearchMode = {}));
function searchTweets(query, maxTweets, searchMode, auth) {
    return (0, timeline_async_1.getTweetTimeline)(query, maxTweets, (q, mt, c) => {
        return fetchSearchTweets(q, mt, searchMode, auth, c);
    });
}
exports.searchTweets = searchTweets;
function searchProfiles(query, maxProfiles, auth) {
    return (0, timeline_async_1.getUserTimeline)(query, maxProfiles, (q, mt, c) => {
        return fetchSearchProfiles(q, mt, auth, c);
    });
}
exports.searchProfiles = searchProfiles;
async function fetchSearchTweets(query, maxTweets, searchMode, auth, cursor) {
    const timeline = await getSearchTimeline(query, maxTweets, searchMode, auth, cursor);
    return (0, timeline_search_1.parseSearchTimelineTweets)(timeline);
}
exports.fetchSearchTweets = fetchSearchTweets;
async function fetchListTweets(listId, maxTweets, auth, cursor) {
    const timeline = await getListTimeline(listId, maxTweets, auth, cursor);
    return (0, timeline_search_list_1.parseListTimelineTweets)(timeline);
}
exports.fetchListTweets = fetchListTweets;
async function fetchSearchProfiles(query, maxProfiles, auth, cursor) {
    const timeline = await getSearchTimeline(query, maxProfiles, SearchMode.Users, auth, cursor);
    return (0, timeline_search_1.parseSearchTimelineUsers)(timeline);
}
exports.fetchSearchProfiles = fetchSearchProfiles;
async function getSearchTimeline(query, maxItems, searchMode, auth, cursor) {
    if (!auth.isLoggedIn()) {
        throw new Error('Scraper is not logged-in for search.');
    }
    if (maxItems > 50) {
        maxItems = 50;
    }
    const variables = {
        rawQuery: query,
        count: maxItems,
        querySource: 'typed_query',
        product: 'Top',
    };
    const features = (0, api_1.addApiFeatures)({
        longform_notetweets_inline_media_enabled: true,
        responsive_web_enhance_cards_enabled: false,
        responsive_web_media_download_video_enabled: false,
        responsive_web_twitter_article_tweet_consumption_enabled: false,
        tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
    });
    const fieldToggles = {
        withArticleRichContentState: false,
    };
    if (cursor != null && cursor != '') {
        variables['cursor'] = cursor;
    }
    switch (searchMode) {
        case SearchMode.Latest:
            variables.product = 'Latest';
            break;
        case SearchMode.Photos:
            variables.product = 'Photos';
            break;
        case SearchMode.Videos:
            variables.product = 'Videos';
            break;
        case SearchMode.Users:
            variables.product = 'People';
            break;
        default:
            break;
    }
    const params = new URLSearchParams();
    params.set('features', (0, json_stable_stringify_1.default)(features));
    params.set('fieldToggles', (0, json_stable_stringify_1.default)(fieldToggles));
    params.set('variables', (0, json_stable_stringify_1.default)(variables));
    const res = await (0, api_1.requestApi)(`https://twitter.com/i/api/graphql/nK1dw4oV3k4w5TdtcAdSww/SearchTimeline?${params.toString()}`, auth);
    if (!res.success) {
        throw res.err;
    }
    return res.value;
}
async function getListTimeline(listId, maxItems, 
// searchMode: SearchMode,
auth, cursor) {
    if (!auth.isLoggedIn()) {
        throw new Error('Scraper is not logged-in for search.');
    }
    if (maxItems > 50) {
        maxItems = 50;
    }
    const variables = {
        listId: listId,
        count: maxItems,
    };
    // const a = {
    //   variables: { "listId": "1281464405444583424", "count": 20 }
    //   features: { "rweb_lists_timeline_redesign_enabled": true, "responsive_web_graphql_exclude_directive_enabled": true, "verified_phone_label_enabled": false, "creator_subscriptions_tweet_preview_api_enabled": true, "responsive_web_graphql_timeline_navigation_enabled": true, "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false, "tweetypie_unmention_optimization_enabled": true, "responsive_web_edit_tweet_api_enabled": true, "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true, "view_counts_everywhere_api_enabled": true, "longform_notetweets_consumption_enabled": true, "responsive_web_twitter_article_tweet_consumption_enabled": false, "tweet_awards_web_tipping_enabled": false, "freedom_of_speech_not_reach_fetch_enabled": true, "standardized_nudges_misinfo": true, "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true, "longform_notetweets_rich_text_read_enabled": true, "longform_notetweets_inline_media_enabled": true, "responsive_web_media_download_video_enabled": false, "responsive_web_enhance_cards_enabled": false }
    //   fieldToggles: { "withArticleRichContentState": false }
    // }
    // const features = addApiFeatures({
    //   longform_notetweets_inline_media_enabled: true,
    //   responsive_web_enhance_cards_enabled: false,
    //   responsive_web_media_download_video_enabled: false,
    //   responsive_web_twitter_article_tweet_consumption_enabled: false,
    //   tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled:
    //     true,
    // });
    const fieldToggles = {
        withArticleRichContentState: false,
    };
    if (cursor != null && cursor != '') {
        variables['cursor'] = cursor;
    }
    const params = new URLSearchParams();
    params.set('features', '{"rweb_lists_timeline_redesign_enabled":true,"responsive_web_graphql_exclude_directive_enabled":true,"verified_phone_label_enabled":false,"creator_subscriptions_tweet_preview_api_enabled":true,"responsive_web_graphql_timeline_navigation_enabled":true,"responsive_web_graphql_skip_user_profile_image_extensions_enabled":false,"tweetypie_unmention_optimization_enabled":true,"responsive_web_edit_tweet_api_enabled":true,"graphql_is_translatable_rweb_tweet_is_translatable_enabled":true,"view_counts_everywhere_api_enabled":true,"longform_notetweets_consumption_enabled":true,"responsive_web_twitter_article_tweet_consumption_enabled":false,"tweet_awards_web_tipping_enabled":false,"freedom_of_speech_not_reach_fetch_enabled":true,"standardized_nudges_misinfo":true,"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled":true,"longform_notetweets_rich_text_read_enabled":true,"longform_notetweets_inline_media_enabled":true,"responsive_web_enhance_cards_enabled":false}');
    // params.set('features', stringify(features));
    params.set('fieldToggles', (0, json_stable_stringify_1.default)(fieldToggles));
    params.set('variables', (0, json_stable_stringify_1.default)(variables));
    const res = await (0, api_1.requestApi)(`https://twitter.com/i/api/graphql/hVmwm1awr93NKXPGdTXoGg/ListLatestTweetsTimeline?${params.toString()}`, auth);
    if (!res.success) {
        throw res.err;
    }
    return res.value;
}
//# sourceMappingURL=search.js.map