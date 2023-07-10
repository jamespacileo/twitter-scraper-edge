import { LegacyUserRaw, Profile } from './profile';
import { PlaceRaw, Tweet } from './tweets';
export interface Hashtag {
    text?: string;
}
export interface TimelineUserMentionBasicRaw {
    id_str?: string;
    name?: string;
    screen_name?: string;
}
export interface TimelineMediaBasicRaw {
    media_url_https?: string;
    type?: string;
    url?: string;
}
export interface TimelineUrlBasicRaw {
    expanded_url?: string;
    url?: string;
}
export interface ExtSensitiveMediaWarningRaw {
    adult_content?: boolean;
    graphic_violence?: boolean;
    other?: boolean;
}
export interface VideoVariant {
    bitrate?: number;
    url?: string;
}
export interface VideoInfo {
    variants?: VideoVariant[];
}
export interface TimelineMediaExtendedRaw {
    id_str?: string;
    media_url_https?: string;
    ext_sensitive_media_warning?: ExtSensitiveMediaWarningRaw;
    type?: string;
    url?: string;
    video_info?: VideoInfo;
}
export interface TimelineResultRaw {
    __typename?: string;
    core?: {
        user_results?: {
            result?: {
                is_blue_verified?: boolean;
                legacy?: LegacyUserRaw;
            };
        };
    };
    views?: {
        count?: string;
    };
    note_tweet?: {
        note_tweet_results?: {
            result?: {
                text?: string;
            };
        };
    };
    quoted_status_result?: {
        result?: TimelineResultRaw;
    };
    legacy?: LegacyTweetRaw;
}
export interface LegacyTweetRaw {
    conversation_id_str?: string;
    created_at?: string;
    favorite_count?: number;
    full_text?: string;
    entities?: {
        hashtags?: Hashtag[];
        media?: TimelineMediaBasicRaw[];
        urls?: TimelineUrlBasicRaw[];
        user_mentions?: TimelineUserMentionBasicRaw[];
    };
    extended_entities?: {
        media?: TimelineMediaExtendedRaw[];
    };
    id_str?: string;
    in_reply_to_status_id_str?: string;
    place?: PlaceRaw;
    reply_count?: number;
    retweet_count?: number;
    retweeted_status_id_str?: string;
    retweeted_status_result?: {
        result?: TimelineResultRaw;
    };
    quoted_status_id_str?: string;
    time?: string;
    user_id_str?: string;
    ext_views?: {
        state?: string;
        count?: string;
    };
}
export interface TimelineGlobalObjectsRaw {
    tweets?: {
        [key: string]: LegacyTweetRaw | undefined;
    };
    users?: {
        [key: string]: LegacyUserRaw | undefined;
    };
}
export interface TimelineDataRawCursor {
    value?: string;
    cursorType?: string;
}
export interface TimelineDataRawEntity {
    id?: string;
}
export interface TimelineDataRawModuleItem {
    clientEventInfo?: {
        details?: {
            guideDetails?: {
                transparentGuideDetails?: {
                    trendMetadata?: {
                        trendName?: string;
                    };
                };
            };
        };
    };
}
export interface TimelineDataRawAddEntry {
    content?: {
        item?: {
            content?: {
                tweet?: TimelineDataRawEntity;
                user?: TimelineDataRawEntity;
            };
        };
        operation?: {
            cursor?: TimelineDataRawCursor;
        };
        timelineModule?: {
            items?: {
                item?: TimelineDataRawModuleItem;
            }[];
        };
    };
}
export interface TimelineDataRawPinEntry {
    content?: {
        item?: {
            content?: {
                tweet?: TimelineDataRawEntity;
            };
        };
    };
}
export interface TimelineDataRawReplaceEntry {
    content?: {
        operation?: {
            cursor?: TimelineDataRawCursor;
        };
    };
}
export interface TimelineDataRawInstruction {
    addEntries?: {
        entries?: TimelineDataRawAddEntry[];
    };
    pinEntry?: {
        entry?: TimelineDataRawPinEntry;
    };
    replaceEntry?: {
        entry?: TimelineDataRawReplaceEntry;
    };
}
export interface TimelineDataRaw {
    instructions?: TimelineDataRawInstruction[];
}
export interface TimelineV1 {
    globalObjects?: TimelineGlobalObjectsRaw;
    timeline?: TimelineDataRaw;
}
export type ParseTweetResult = {
    success: true;
    tweet: Tweet;
} | {
    success: false;
    err: Error;
};
/**
 * A paginated tweets API response. The `next` field can be used to fetch the next page of results.
 */
export interface QueryTweetsResponse {
    tweets: Tweet[];
    next?: string;
}
export declare function parseTimelineTweetsV1(timeline: TimelineV1): QueryTweetsResponse;
/**
 * A paginated profiles API response. The `next` field can be used to fetch the next page of results.
 */
export interface QueryProfilesResponse {
    profiles: Profile[];
    next?: string;
}
export declare function parseUsers(timeline: TimelineV1): QueryProfilesResponse;
//# sourceMappingURL=timeline-v1.d.ts.map