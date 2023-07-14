import { TwitterAuth } from './auth';
export declare const bearerToken = "AAAAAAAAAAAAAAAAAAAAAFQODgEAAAAAVHTp76lzh3rFzcHbmHVvQxYYpTw%3DckAlMINMjmCwxUcaXbAN4XqJVdgMJaHqNOFgPMK0zN1qLqLQCF";
/**
 * An API result container.
 */
export type RequestApiResult<T> = {
    success: true;
    value: T;
} | {
    success: false;
    err: Error;
};
/**
 * Used internally to send HTTP requests to the Twitter API.
 * @internal
 *
 * @param url - The URL to send the request to.
 * @param auth - The instance of {@link TwitterAuth} that will be used to authorize this request.
 * @param method - The HTTP method used when sending this request.
 */
export declare function requestApi<T>(url: string, auth: TwitterAuth, method?: 'GET' | 'POST'): Promise<RequestApiResult<T>>;
/**
 * @internal
 */
export declare function addApiFeatures(o: object): {
    rweb_lists_timeline_redesign_enabled: boolean;
    responsive_web_graphql_exclude_directive_enabled: boolean;
    verified_phone_label_enabled: boolean;
    creator_subscriptions_tweet_preview_api_enabled: boolean;
    responsive_web_graphql_timeline_navigation_enabled: boolean;
    responsive_web_graphql_skip_user_profile_image_extensions_enabled: boolean;
    tweetypie_unmention_optimization_enabled: boolean;
    responsive_web_edit_tweet_api_enabled: boolean;
    graphql_is_translatable_rweb_tweet_is_translatable_enabled: boolean;
    view_counts_everywhere_api_enabled: boolean;
    longform_notetweets_consumption_enabled: boolean;
    tweet_awards_web_tipping_enabled: boolean;
    freedom_of_speech_not_reach_fetch_enabled: boolean;
    standardized_nudges_misinfo: boolean;
    longform_notetweets_rich_text_read_enabled: boolean;
    responsive_web_enhance_cards_enabled: boolean;
};
export declare function addApiParams(params: URLSearchParams, includeTweetReplies: boolean): URLSearchParams;
//# sourceMappingURL=api.d.ts.map