import { QueryTweetsResponse } from "./timeline-v1";
import { TimelineEntryRaw } from "./timeline-v2";
export interface ListTimelineV23 {
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
export interface ListTimelineV2 {
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
export declare function parseTimelineTweetsV2(timeline: ListTimelineV2): QueryTweetsResponse;
//# sourceMappingURL=list-v2.d.ts.map