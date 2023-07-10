import { TwitterAuth } from './auth';
import { Profile } from './profile';
import { QueryProfilesResponse, QueryTweetsResponse } from './timeline-v1';
import { Tweet } from './tweets';
/**
 * The categories that can be used in Twitter searches.
 */
export declare enum SearchMode {
    Top = 0,
    Latest = 1,
    Photos = 2,
    Videos = 3,
    Users = 4
}
export declare function searchTweets(query: string, maxTweets: number, searchMode: SearchMode, auth: TwitterAuth): AsyncGenerator<Tweet, void>;
export declare function searchProfiles(query: string, maxProfiles: number, auth: TwitterAuth): AsyncGenerator<Profile, void>;
export declare function fetchSearchTweets(query: string, maxTweets: number, searchMode: SearchMode, auth: TwitterAuth, cursor?: string): Promise<QueryTweetsResponse>;
export declare function fetchListTweets(listId: string, maxTweets: number, auth: TwitterAuth, cursor?: string): Promise<QueryTweetsResponse>;
export declare function fetchSearchProfiles(query: string, maxProfiles: number, auth: TwitterAuth, cursor?: string): Promise<QueryProfilesResponse>;
//# sourceMappingURL=search.d.ts.map