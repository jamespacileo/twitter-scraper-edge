"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reconstructTweetHtml = exports.parseMediaGroups = void 0;
const type_util_1 = require("./type-util");
const reHashtag = /\B(\#\S+\b)/g;
const reTwitterUrl = /https:(\/\/t\.co\/([A-Za-z0-9]|[A-Za-z]){10})/g;
const reUsername = /\B(\@\S{1,15}\b)/g;
function parseMediaGroups(media) {
    const photos = [];
    const videos = [];
    let sensitiveContent = undefined;
    for (const m of media
        .filter((0, type_util_1.isFieldDefined)('id_str'))
        .filter((0, type_util_1.isFieldDefined)('media_url_https'))) {
        if (m.type === 'photo') {
            photos.push({
                id: m.id_str,
                url: m.media_url_https,
            });
        }
        else if (m.type === 'video') {
            videos.push(parseVideo(m));
        }
        const sensitive = m.ext_sensitive_media_warning;
        if (sensitive != null) {
            sensitiveContent =
                sensitive.adult_content ||
                    sensitive.graphic_violence ||
                    sensitive.other;
        }
    }
    return { sensitiveContent, photos, videos };
}
exports.parseMediaGroups = parseMediaGroups;
function parseVideo(m) {
    const video = {
        id: m.id_str,
        preview: m.media_url_https,
    };
    let maxBitrate = 0;
    const variants = m.video_info?.variants ?? [];
    for (const variant of variants) {
        const bitrate = variant.bitrate;
        if (bitrate != null && bitrate > maxBitrate && variant.url != null) {
            let variantUrl = variant.url;
            const stringStart = 0;
            const tagSuffixIdx = variantUrl.indexOf('?tag=10');
            if (tagSuffixIdx !== -1) {
                variantUrl = variantUrl.substring(stringStart, tagSuffixIdx + 1);
            }
            video.url = variantUrl;
            maxBitrate = bitrate;
        }
    }
    return video;
}
function reconstructTweetHtml(tweet, photos, videos) {
    const media = [];
    // HTML parsing with regex :)
    let html = tweet.full_text ?? '';
    html = html.replace(reHashtag, linkHashtagHtml);
    html = html.replace(reUsername, linkUsernameHtml);
    html = html.replace(reTwitterUrl, unwrapTcoUrlHtml(tweet, media));
    for (const { url } of photos) {
        if (media.indexOf(url) !== -1) {
            continue;
        }
        html += `<br><img src="${url}"/>`;
    }
    for (const { preview: url } of videos) {
        if (media.indexOf(url) !== -1) {
            continue;
        }
        html += `<br><img src="${url}"/>`;
    }
    html = html.replace(/\n/g, '<br>');
    return html;
}
exports.reconstructTweetHtml = reconstructTweetHtml;
function linkHashtagHtml(hashtag) {
    return `<a href="https://twitter.com/hashtag/${hashtag.replace('#', '')}">${hashtag}</a>`;
}
function linkUsernameHtml(username) {
    return `<a href="https://twitter.com/${username[0].replace('@', '')}">${username[0]}</a>`;
}
function unwrapTcoUrlHtml(tweet, foundedMedia) {
    return function (tco) {
        for (const entity of tweet.entities?.urls ?? []) {
            if (tco === entity.url && entity.expanded_url != null) {
                return `<a href="${entity.expanded_url}">${tco}</a>`;
            }
        }
        for (const entity of tweet.extended_entities?.media ?? []) {
            if (tco === entity.url && entity.media_url_https != null) {
                foundedMedia.push(entity.media_url_https);
                return `<br><a href="${tco}"><img src="${entity.media_url_https}"/></a>`;
            }
        }
        return tco;
    };
}
//# sourceMappingURL=timeline-tweet-util.js.map