import { CookieJar } from 'tough-cookie';
import { Headers } from 'headers-polyfill';
export interface TwitterAuth {
    /**
     * Returns the current cookie jar.
     */
    cookieJar(): CookieJar;
    /**
     * Returns if a user is logged-in to Twitter through this instance.
     * @returns `true` if a user is logged-in; otherwise `false`.
     */
    isLoggedIn(): Promise<boolean>;
    /**
     * Logs into a Twitter account.
     * @param username The username to log in with.
     * @param password The password to log in with.
     * @param email The password to log in with, if you have email confirmation enabled.
     */
    login(username: string, password: string, email?: string): Promise<void>;
    /**
     * Logs out of the current session.
     */
    logout(): Promise<void>;
    /**
     * Deletes the current guest token token.
     */
    deleteToken(): void;
    /**
     * Returns if the authentication state has a token.
     * @returns `true` if the authentication state has a token; `false` otherwise.
     */
    hasToken(): boolean;
    /**
     * Returns the time that authentication was performed.
     * @returns The time at which the authentication token was created, or `null` if it hasn't been created yet.
     */
    authenticatedAt(): Date | null;
    /**
     * Installs the authentication information into a headers-like object. If needed, the
     * authentication token will be updated from the API automatically.
     * @param headers A Headers instance representing a request's headers.
     */
    installTo(headers: Headers, url: string): Promise<void>;
}
/**
 * A guest authentication token manager. Automatically handles token refreshes.
 */
export declare class TwitterGuestAuth implements TwitterAuth {
    protected bearerToken: string;
    protected jar: CookieJar;
    protected guestToken?: string;
    protected guestCreatedAt?: Date;
    constructor(bearerToken: string);
    cookieJar(): CookieJar;
    isLoggedIn(): Promise<boolean>;
    login(_username: string, _password: string, _email?: string): Promise<void>;
    logout(): Promise<void>;
    deleteToken(): void;
    hasToken(): boolean;
    authenticatedAt(): Date | null;
    installTo(headers: Headers, url: string): Promise<void>;
    /**
     * Updates the authentication state with a new guest token from the Twitter API.
     */
    protected updateGuestToken(): Promise<void>;
    /**
     * Returns if the authentication token needs to be updated or not.
     * @returns `true` if the token needs to be updated; `false` otherwise.
     */
    private shouldUpdate;
}
//# sourceMappingURL=auth.d.ts.map