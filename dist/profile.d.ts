import { RequestApiResult } from './api';
import { TwitterAuth } from './auth';
export interface LegacyUserRaw {
    created_at?: string;
    description?: string;
    entities?: {
        url?: {
            urls?: {
                expanded_url?: string;
            }[];
        };
    };
    favourites_count?: number;
    followers_count?: number;
    friends_count?: number;
    id_str?: string;
    listed_count?: number;
    name?: string;
    location: string;
    pinned_tweet_ids_str?: string[];
    profile_banner_url?: string;
    profile_image_url_https?: string;
    protected?: boolean;
    screen_name?: string;
    statuses_count?: number;
    verified?: boolean;
}
/**
 * A parsed profile object.
 */
export interface Profile {
    avatar?: string;
    banner?: string;
    biography?: string;
    birthday?: string;
    followersCount?: number;
    followingCount?: number;
    friendsCount?: number;
    isPrivate?: boolean;
    isVerified?: boolean;
    joined?: Date;
    likesCount?: number;
    listedCount?: number;
    location: string;
    name?: string;
    pinnedTweetIds?: string[];
    tweetsCount?: number;
    url?: string;
    userId?: string;
    username?: string;
    website?: string;
}
export interface UserRaw {
    data: {
        user: {
            rest_id?: string;
            legacy: LegacyUserRaw;
        };
    };
    errors?: {
        message: string;
    }[];
}
export declare function parseProfile(user: LegacyUserRaw): Profile;
export declare function getProfile(username: string, auth: TwitterAuth): Promise<RequestApiResult<Profile>>;
export declare function getUserIdByScreenName(screenName: string, auth: TwitterAuth): Promise<RequestApiResult<string>>;
//# sourceMappingURL=profile.d.ts.map