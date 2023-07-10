import { LegacyUserRaw } from './profile';
import { LegacyTweetRaw, ParseTweetResult, QueryTweetsResponse, TimelineResultRaw } from './timeline-v1';
import { Tweet } from './tweets';
export interface TimelineUserResultRaw {
    rest_id?: string;
    legacy?: LegacyUserRaw;
}
export interface TimelineEntryItemContentRaw {
    tweetDisplayType?: string;
    tweet_results?: {
        result?: TimelineResultRaw;
    };
    userDisplayType?: string;
    user_results?: {
        result?: TimelineUserResultRaw;
    };
}
export interface TimelineEntryRaw {
    content?: {
        cursorType?: string;
        value?: string;
        items?: {
            item?: {
                itemContent?: TimelineEntryItemContentRaw;
            };
        }[];
        itemContent?: TimelineEntryItemContentRaw;
    };
}
export interface TimelineV2 {
    data?: {
        user?: {
            result?: {
                timeline_v2?: {
                    timeline?: {
                        instructions?: {
                            entries?: TimelineEntryRaw[];
                            entry?: TimelineEntryRaw;
                            type?: string;
                        }[];
                    };
                };
            };
        };
    };
}
export interface ThreadedConversation {
    data?: {
        threaded_conversation_with_injections_v2?: {
            instructions?: {
                entries?: TimelineEntryRaw[];
                entry?: TimelineEntryRaw;
                type?: string;
            }[];
        };
    };
}
export declare function parseLegacyTweet(user?: LegacyUserRaw, tweet?: LegacyTweetRaw): ParseTweetResult;
export declare function parseTimelineTweetsV2(timeline: TimelineV2): QueryTweetsResponse;
export declare function parseThreadedConversation(conversation: ThreadedConversation): Tweet[];
//# sourceMappingURL=timeline-v2.d.ts.map