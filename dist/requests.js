"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCookieJar = void 0;
const tough_cookie_1 = require("tough-cookie");
const set_cookie_parser_1 = __importDefault(require("set-cookie-parser"));
/**
 * Updates a cookie jar with the Set-Cookie headers from the provided Headers instance.
 * @param cookieJar The cookie jar to update.
 * @param headers The response headers to populate the cookie jar with.
 */
async function updateCookieJar(cookieJar, headers) {
    const setCookieHeader = headers.get('set-cookie');
    if (setCookieHeader) {
        const cookies = set_cookie_parser_1.default.splitCookiesString(setCookieHeader);
        for (const cookie of cookies.map((c) => tough_cookie_1.Cookie.parse(c))) {
            if (!cookie)
                continue;
            await cookieJar.setCookie(cookie, `${cookie.secure ? 'https' : 'http'}://${cookie.domain}${cookie.path}`);
        }
    }
}
exports.updateCookieJar = updateCookieJar;
//# sourceMappingURL=requests.js.map