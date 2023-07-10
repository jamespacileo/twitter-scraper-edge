import { CookieJar } from 'tough-cookie';
import type { Headers as HeadersPolyfill } from 'headers-polyfill';
/**
 * Updates a cookie jar with the Set-Cookie headers from the provided Headers instance.
 * @param cookieJar The cookie jar to update.
 * @param headers The response headers to populate the cookie jar with.
 */
export declare function updateCookieJar(cookieJar: CookieJar, headers: Headers | HeadersPolyfill): Promise<void>;
//# sourceMappingURL=requests.d.ts.map