import { Profile } from './profile';
import { Tweet } from './tweets';
export interface FetchProfilesResponse {
    profiles: Profile[];
    next?: string;
}
export type FetchProfiles = (query: string, maxProfiles: number, cursor: string | undefined) => Promise<FetchProfilesResponse>;
export interface FetchTweetsResponse {
    tweets: Tweet[];
    next?: string;
}
export type FetchTweets = (query: string, maxTweets: number, cursor: string | undefined) => Promise<FetchTweetsResponse>;
export declare function getUserTimeline(query: string, maxProfiles: number, fetchFunc: FetchProfiles): AsyncGenerator<Profile, void>;
export declare function getTweetTimeline(query: string, maxTweets: number, fetchFunc: FetchTweets): AsyncGenerator<Tweet, void>;
//# sourceMappingURL=timeline-async.d.ts.map