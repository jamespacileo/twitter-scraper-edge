"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterUserAuth = void 0;
const auth_1 = require("./auth");
const api_1 = require("./api");
const tough_cookie_1 = require("tough-cookie");
const requests_1 = require("./requests");
const headers_polyfill_1 = require("headers-polyfill");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
/**
 * A user authentication token manager.
 */
class TwitterUserAuth extends auth_1.TwitterGuestAuth {
    constructor(bearerToken) {
        super(bearerToken);
    }
    async isLoggedIn() {
        const res = await (0, api_1.requestApi)('https://api.twitter.com/1.1/account/verify_credentials.json', this);
        if (!res.success) {
            return false;
        }
        const { value: verify } = res;
        return verify && !verify.errors?.length;
    }
    async login(username, password, email) {
        await this.updateGuestToken();
        // Executes the potential acid step in the login flow
        const executeFlowAcid = (ft) => this.executeFlowTask({
            flow_token: ft,
            subtask_inputs: [
                {
                    subtask_id: 'LoginAcid',
                    enter_text: {
                        text: email,
                        link: 'next_link',
                    },
                },
            ],
        });
        // Handles the result of a flow task
        const handleFlowTokenResult = async (p) => {
            const result = await p;
            const { status } = result;
            if (status === 'error') {
                throw result.err;
            }
            else if (status === 'acid') {
                return await handleFlowTokenResult(executeFlowAcid(result.flowToken));
            }
            else {
                return result.flowToken;
            }
        };
        // Executes a flow subtask and handles the result
        const executeFlowSubtask = (data) => handleFlowTokenResult(this.executeFlowTask(data));
        await executeFlowSubtask({
            flow_name: 'login',
            input_flow_data: {
                flow_context: {
                    debug_overrides: {},
                    start_location: {
                        location: 'splash_screen',
                    },
                },
            },
        })
            .then((ft) => executeFlowSubtask({
            flow_token: ft,
            subtask_inputs: [
                {
                    subtask_id: 'LoginJsInstrumentationSubtask',
                    js_instrumentation: {
                        response: '{}',
                        link: 'next_link',
                    },
                },
            ],
        }))
            .then((ft) => executeFlowSubtask({
            flow_token: ft,
            subtask_inputs: [
                {
                    subtask_id: 'LoginEnterUserIdentifierSSO',
                    settings_list: {
                        setting_responses: [
                            {
                                key: 'user_identifier',
                                response_data: {
                                    text_data: { result: username },
                                },
                            },
                        ],
                        link: 'next_link',
                    },
                },
            ],
        }))
            .then((ft) => executeFlowSubtask({
            flow_token: ft,
            subtask_inputs: [
                {
                    subtask_id: 'LoginEnterPassword',
                    enter_password: {
                        password,
                        link: 'next_link',
                    },
                },
            ],
        }))
            .then((ft) => executeFlowSubtask({
            flow_token: ft,
            subtask_inputs: [
                {
                    subtask_id: 'AccountDuplicationCheck',
                    check_logged_in_account: {
                        link: 'AccountDuplicationCheck_false',
                    },
                },
            ],
        }));
    }
    async logout() {
        if (!this.isLoggedIn()) {
            return;
        }
        if (process.env.TWITTER_ALLOW_LOGOUT !== 'true') {
            throw new Error("Should not log out! Only if needed!");
        }
        await (0, api_1.requestApi)('https://api.twitter.com/1.1/account/logout.json', this, 'POST');
        this.deleteToken();
        this.jar = new tough_cookie_1.CookieJar();
    }
    async installTo(headers, url) {
        headers.set('authorization', `Bearer ${this.bearerToken}`);
        headers.set('cookie', await this.jar.getCookieString(url));
        const cookies = await this.jar.getCookies(url);
        const xCsrfToken = cookies.find((cookie) => cookie.key === 'ct0');
        if (xCsrfToken) {
            headers.set('x-csrf-token', xCsrfToken.value);
        }
    }
    async executeFlowTask(data) {
        const onboardingTaskUrl = 'https://api.twitter.com/1.1/onboarding/task.json';
        const token = this.guestToken;
        if (token == null) {
            throw new Error('Authentication token is null or undefined.');
        }
        const headers = new headers_polyfill_1.Headers({
            authorization: `Bearer ${this.bearerToken}`,
            cookie: await this.jar.getCookieString(onboardingTaskUrl),
            'content-type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 11; Nokia G20) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.88 Mobile Safari/537.36',
            'x-guest-token': token,
            'x-twitter-auth-type': 'OAuth2Client',
            'x-twitter-active-user': 'yes',
            'x-twitter-client-language': 'en',
        });
        const res = await (0, cross_fetch_1.default)(onboardingTaskUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        });
        await (0, requests_1.updateCookieJar)(this.jar, res.headers);
        if (!res.ok) {
            return { status: 'error', err: new Error(await res.text()) };
        }
        const flow = await res.json();
        if (flow?.flow_token == null) {
            return { status: 'error', err: new Error('flow_token not found.') };
        }
        if (flow.errors?.length) {
            return {
                status: 'error',
                err: new Error(`Authentication error (${flow.errors[0].code}): ${flow.errors[0].message}`),
            };
        }
        if (typeof flow.flow_token !== 'string') {
            return {
                status: 'error',
                err: new Error('flow_token was not a string.'),
            };
        }
        if (flow.subtasks?.length) {
            if (flow.subtasks[0].subtask_id === 'LoginEnterAlternateIdentifierSubtask') {
                return {
                    status: 'error',
                    err: new Error('Authentication error: LoginEnterAlternateIdentifierSubtask'),
                };
            }
            else if (flow.subtasks[0].subtask_id === 'LoginAcid') {
                return {
                    status: 'acid',
                    flowToken: flow.flow_token,
                };
            }
            else if (flow.subtasks[0].subtask_id === 'LoginTwoFactorAuthChallenge') {
                return {
                    status: 'error',
                    err: new Error('Authentication error: LoginTwoFactorAuthChallenge'),
                };
            }
            else if (flow.subtasks[0].subtask_id === 'DenyLoginSubtask') {
                return {
                    status: 'error',
                    err: new Error('Authentication error: DenyLoginSubtask'),
                };
            }
        }
        return {
            status: 'success',
            flowToken: flow.flow_token,
        };
    }
}
exports.TwitterUserAuth = TwitterUserAuth;
//# sourceMappingURL=auth-user.js.map