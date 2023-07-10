import { QueryProfilesResponse, QueryTweetsResponse } from './timeline-v1';
import { TimelineEntryRaw } from './timeline-v2';
export interface ListSearchTimeline {
    data?: {
        list?: {
            tweets_timeline?: {
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
}
export declare function parseListTimelineTweets(timeline: ListSearchTimeline): QueryTweetsResponse;
export declare function parseListTimelineUsers(timeline: ListSearchTimeline): QueryProfilesResponse;
//# sourceMappingURL=timeline-search-list.d.ts.map