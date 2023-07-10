"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterGuestAuth = void 0;
const tough_cookie_1 = require("tough-cookie");
const requests_1 = require("./requests");
const headers_polyfill_1 = require("headers-polyfill");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
/**
 * A guest authentication token manager. Automatically handles token refreshes.
 */
class TwitterGuestAuth {
    constructor(bearerToken) {
        this.bearerToken = bearerToken;
        this.jar = new tough_cookie_1.CookieJar();
    }
    cookieJar() {
        return this.jar;
    }
    isLoggedIn() {
        return Promise.resolve(false);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    login(_username, _password, _email) {
        return this.updateGuestToken();
    }
    logout() {
        this.deleteToken();
        this.jar = new tough_cookie_1.CookieJar();
        return Promise.resolve();
    }
    deleteToken() {
        delete this.guestToken;
        delete this.guestCreatedAt;
    }
    hasToken() {
        return this.guestToken != null;
    }
    authenticatedAt() {
        if (this.guestCreatedAt == null) {
            return null;
        }
        return new Date(this.guestCreatedAt);
    }
    async installTo(headers, url) {
        if (this.shouldUpdate()) {
            await this.updateGuestToken();
        }
        const token = this.guestToken;
        if (token == null) {
            throw new Error('Authentication token is null or undefined.');
        }
        headers.set('authorization', `Bearer ${this.bearerToken}`);
        headers.set('x-guest-token', token);
        const cookies = await this.jar.getCookies(url);
        const xCsrfToken = cookies.find((cookie) => cookie.key === 'ct0');
        if (xCsrfToken) {
            headers.set('x-csrf-token', xCsrfToken.value);
        }
        headers.set('cookie', await this.jar.getCookieString(url));
    }
    /**
     * Updates the authentication state with a new guest token from the Twitter API.
     */
    async updateGuestToken() {
        const guestActivateUrl = 'https://api.twitter.com/1.1/guest/activate.json';
        const headers = new headers_polyfill_1.Headers({
            Authorization: `Bearer ${this.bearerToken}`,
            Cookie: await this.jar.getCookieString(guestActivateUrl),
        });
        const res = await (0, cross_fetch_1.default)(guestActivateUrl, {
            method: 'POST',
            headers: headers,
        });
        await (0, requests_1.updateCookieJar)(this.jar, res.headers);
        if (!res.ok) {
            throw new Error(await res.text());
        }
        const o = await res.json();
        if (o == null || o['guest_token'] == null) {
            throw new Error('guest_token not found.');
        }
        const newGuestToken = o['guest_token'];
        if (typeof newGuestToken !== 'string') {
            throw new Error('guest_token was not a string.');
        }
        this.guestToken = newGuestToken;
        this.guestCreatedAt = new Date();
    }
    /**
     * Returns if the authentication token needs to be updated or not.
     * @returns `true` if the token needs to be updated; `false` otherwise.
     */
    shouldUpdate() {
        return (!this.hasToken() ||
            (this.guestCreatedAt != null &&
                this.guestCreatedAt <
                    new Date(new Date().valueOf() - 3 * 60 * 60 * 1000)));
    }
}
exports.TwitterGuestAuth = TwitterGuestAuth;
//# sourceMappingURL=auth.js.map