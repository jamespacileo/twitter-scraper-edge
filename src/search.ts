import { addApiFeatures, requestApi } from './api';
import { TwitterAuth } from './auth';
import { Profile } from './profile';
import { QueryProfilesResponse, QueryTweetsResponse } from './timeline-v1';
import { getTweetTimeline, getUserTimeline } from './timeline-async';
import { Tweet } from './tweets';
import {
  SearchTimeline,
  parseSearchTimelineTweets,
  parseSearchTimelineUsers,
} from './timeline-search';
import stringify from 'json-stable-stringify';
import { ListSearchTimeline, parseListTimelineTweets } from './timeline-search-list';

/**
 * The categories that can be used in Twitter searches.
 */
export enum SearchMode {
  Top,
  Latest,
  Photos,
  Videos,
  Users,
}

export function searchTweets(
  query: string,
  maxTweets: number,
  searchMode: SearchMode,
  auth: TwitterAuth,
): AsyncGenerator<Tweet, void> {
  return getTweetTimeline(query, maxTweets, (q, mt, c) => {
    return fetchSearchTweets(q, mt, searchMode, auth, c);
  });
}

export function searchProfiles(
  query: string,
  maxProfiles: number,
  auth: TwitterAuth,
): AsyncGenerator<Profile, void> {
  return getUserTimeline(query, maxProfiles, (q, mt, c) => {
    return fetchSearchProfiles(q, mt, auth, c);
  });
}

export async function fetchSearchTweets(
  query: string,
  maxTweets: number,
  searchMode: SearchMode,
  auth: TwitterAuth,
  cursor?: string,
): Promise<QueryTweetsResponse> {
  const timeline = await getSearchTimeline(
    query,
    maxTweets,
    searchMode,
    auth,
    cursor,
  );

  return parseSearchTimelineTweets(timeline);
}


export async function fetchListTweets(
  listId: string,
  maxTweets: number,
  auth: TwitterAuth,
  cursor?: string,
): Promise<QueryTweetsResponse> {
  const timeline = await getListTimeline(
    listId,
    maxTweets,
    auth,
    cursor,
  );

  return parseListTimelineTweets(timeline);
}

export async function fetchSearchProfiles(
  query: string,
  maxProfiles: number,
  auth: TwitterAuth,
  cursor?: string,
): Promise<QueryProfilesResponse> {
  const timeline = await getSearchTimeline(
    query,
    maxProfiles,
    SearchMode.Users,
    auth,
    cursor,
  );

  return parseSearchTimelineUsers(timeline);
}

async function getSearchTimeline(
  query: string,
  maxItems: number,
  searchMode: SearchMode,
  auth: TwitterAuth,
  cursor?: string,
): Promise<SearchTimeline> {
  if (!auth.isLoggedIn()) {
    throw new Error('Scraper is not logged-in for search.');
  }

  if (maxItems > 50) {
    maxItems = 50;
  }

  const variables: Record<string, any> = {
    rawQuery: query,
    count: maxItems,
    querySource: 'typed_query',
    product: 'Top',
  };

  const features = addApiFeatures({
    longform_notetweets_inline_media_enabled: true,
    responsive_web_enhance_cards_enabled: false,
    responsive_web_media_download_video_enabled: false,
    responsive_web_twitter_article_tweet_consumption_enabled: false,
    tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled:
      true,
  });

  const fieldToggles: Record<string, any> = {
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
  params.set('features', stringify(features));
  params.set('fieldToggles', stringify(fieldToggles));
  params.set('variables', stringify(variables));

  const res = await requestApi<SearchTimeline>(
    `https://twitter.com/i/api/graphql/nK1dw4oV3k4w5TdtcAdSww/SearchTimeline?${params.toString()}`,
    auth,
  );
  if (!res.success) {
    throw res.err;
  }

  return res.value;
}


async function getListTimeline(
  listId: string,
  maxItems: number,
  // searchMode: SearchMode,
  auth: TwitterAuth,
  cursor?: string,
): Promise<ListSearchTimeline> {
  if (!auth.isLoggedIn()) {
    throw new Error('Scraper is not logged-in for search.');
  }

  if (maxItems > 50) {
    maxItems = 50;
  }

  const variables: Record<string, any> = {
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

  const fieldToggles: Record<string, any> = {
    withArticleRichContentState: false,
  };

  if (cursor != null && cursor != '') {
    variables['cursor'] = cursor;
  }

  const params = new URLSearchParams();
  params.set('features', '{"rweb_lists_timeline_redesign_enabled":true,"responsive_web_graphql_exclude_directive_enabled":true,"verified_phone_label_enabled":false,"creator_subscriptions_tweet_preview_api_enabled":true,"responsive_web_graphql_timeline_navigation_enabled":true,"responsive_web_graphql_skip_user_profile_image_extensions_enabled":false,"tweetypie_unmention_optimization_enabled":true,"responsive_web_edit_tweet_api_enabled":true,"graphql_is_translatable_rweb_tweet_is_translatable_enabled":true,"view_counts_everywhere_api_enabled":true,"longform_notetweets_consumption_enabled":true,"responsive_web_twitter_article_tweet_consumption_enabled":false,"tweet_awards_web_tipping_enabled":false,"freedom_of_speech_not_reach_fetch_enabled":true,"standardized_nudges_misinfo":true,"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled":true,"longform_notetweets_rich_text_read_enabled":true,"longform_notetweets_inline_media_enabled":true,"responsive_web_enhance_cards_enabled":false}')
    
  // params.set('features', stringify(features));
  params.set('fieldToggles', stringify(fieldToggles));
  params.set('variables', stringify(variables));

  const res = await requestApi<ListSearchTimeline>(
    `https://twitter.com/i/api/graphql/hVmwm1awr93NKXPGdTXoGg/ListLatestTweetsTimeline?${params.toString()}`,
    auth,
  );
  if (!res.success) {
    throw res.err;
  }

  return res.value;
}
