"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(response, message) {
        super(message);
        this.response = response;
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=errors.js.map