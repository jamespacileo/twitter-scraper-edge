import { TwitterAuth } from './auth';
import { QueryTweetsResponse } from './timeline-v1';
export interface Mention {
    id: string;
    username?: string;
    name?: string;
}
export interface Photo {
    id: string;
    url: string;
}
export interface Video {
    id: string;
    preview: string;
    url?: string;
}
export interface PlaceRaw {
    id?: string;
    place_type?: string;
    name?: string;
    full_name?: string;
    country_code?: string;
    country?: string;
    bounding_box?: {
        type?: string;
        coordinates?: number[][][];
    };
}
/**
 * A parsed Tweet object.
 */
export interface Tweet {
    conversationId?: string;
    hashtags: string[];
    html?: string;
    id?: string;
    inReplyToStatus?: Tweet;
    inReplyToStatusId?: string;
    isQuoted?: boolean;
    isPin?: boolean;
    isReply?: boolean;
    isRetweet?: boolean;
    isSelfThread?: boolean;
    likes?: number;
    name?: string;
    mentions: Mention[];
    permanentUrl?: string;
    photos: Photo[];
    place?: PlaceRaw;
    quotedStatus?: Tweet;
    quotedStatusId?: string;
    replies?: number;
    retweets?: number;
    retweetedStatus?: Tweet;
    retweetedStatusId?: string;
    text?: string;
    thread: Tweet[];
    timeParsed?: Date;
    timestamp?: number;
    urls: string[];
    userId?: string;
    username?: string;
    videos: Video[];
    views?: number;
    sensitiveContent?: boolean;
}
export declare function fetchTweets(userId: string, maxTweets: number, cursor: string | undefined, auth: TwitterAuth): Promise<QueryTweetsResponse>;
export declare function getTweets(user: string, maxTweets: number, auth: TwitterAuth): AsyncGenerator<Tweet, void>;
export declare function getTweetsByUserId(userId: string, maxTweets: number, auth: TwitterAuth): AsyncGenerator<Tweet, void>;
export declare function getLatestTweet(user: string, includeRetweets: boolean, auth: TwitterAuth): Promise<Tweet | null | void>;
export declare function getTweet(id: string, auth: TwitterAuth): Promise<Tweet | null>;
//# sourceMappingURL=tweets.d.ts.map