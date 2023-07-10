export type NonNullableField<T, K extends keyof T> = {
    [P in K]-?: T[P];
} & T;
export declare function isFieldDefined<T, K extends keyof T>(key: K): (value: T) => value is NonNullableField<T, K>;
export declare function isDefined<T>(value: T | null | undefined): value is T;
//# sourceMappingURL=type-util.d.ts.map