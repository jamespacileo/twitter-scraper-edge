"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrends = void 0;
const api_1 = require("./api");
async function getTrends(auth) {
    const params = new URLSearchParams();
    (0, api_1.addApiParams)(params, false);
    params.set('count', '20');
    params.set('candidate_source', 'trends');
    params.set('include_page_configuration', 'false');
    params.set('entity_tokens', 'false');
    const res = await (0, api_1.requestApi)(`https://api.twitter.com/2/guide.json?${params.toString()}`, auth);
    if (!res.success) {
        throw res.err;
    }
    const instructions = res.value.timeline?.instructions ?? [];
    if (instructions.length < 2) {
        throw new Error('No trend entries found.');
    }
    // Some of this is silly, but for now we're assuming we know nothing about the
    // data, and that anything can be missing. Go has non-nilable strings and empty
    // slices are nil, so it largely doesn't need to worry about this.
    const entries = instructions[1].addEntries?.entries ?? [];
    if (entries.length < 2) {
        throw new Error('No trend entries found.');
    }
    const items = entries[1].content?.timelineModule?.items ?? [];
    const trends = [];
    for (const item of items) {
        const trend = item.item?.clientEventInfo?.details?.guideDetails?.transparentGuideDetails
            ?.trendMetadata?.trendName;
        if (trend != null) {
            trends.push(trend);
        }
    }
    return trends;
}
exports.getTrends = getTrends;
//# sourceMappingURL=trends.js.map