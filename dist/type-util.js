"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDefined = exports.isFieldDefined = void 0;
function isFieldDefined(key) {
    return function (value) {
        return isDefined(value[key]);
    };
}
exports.isFieldDefined = isFieldDefined;
function isDefined(value) {
    return value != null;
}
exports.isDefined = isDefined;
//# sourceMappingURL=type-util.js.map