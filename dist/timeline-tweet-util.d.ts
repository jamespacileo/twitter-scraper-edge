import { LegacyTweetRaw, TimelineMediaExtendedRaw } from './timeline-v1';
import { Photo, Video } from './tweets';
export declare function parseMediaGroups(media: TimelineMediaExtendedRaw[]): {
    sensitiveContent?: boolean;
    photos: Photo[];
    videos: Video[];
};
export declare function reconstructTweetHtml(tweet: LegacyTweetRaw, photos: Photo[], videos: Video[]): string;
//# sourceMappingURL=timeline-tweet-util.d.ts.map