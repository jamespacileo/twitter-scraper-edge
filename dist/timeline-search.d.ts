import { QueryProfilesResponse, QueryTweetsResponse } from './timeline-v1';
import { TimelineEntryRaw } from './timeline-v2';
export interface SearchTimeline {
    data?: {
        search_by_raw_query?: {
            search_timeline?: {
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
export declare function parseSearchTimelineTweets(timeline: SearchTimeline): QueryTweetsResponse;
export declare function parseSearchTimelineUsers(timeline: SearchTimeline): QueryProfilesResponse;
//# sourceMappingURL=timeline-search.d.ts.map