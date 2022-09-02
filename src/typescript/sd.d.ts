declare type ThisArgType<T> = T;
declare type IDecorator<T> = (thisArgs: ThisArgType<T>, property: string, ...args: unknown[]) => unknown;
declare type IDecoratorMethodType = (method: (...args: unknown[]) => unknown, property: string, ...args: unknown[]) => unknown;
declare type IDecoratorType<T> = IDecorator<T>;
interface IHandler<T> {
    [property: string]: IDecoratorType<T> | IDecoratorType<T>[];
}
interface IHandlerMethod {
    [property: string]: IDecoratorMethodType | IDecoratorMethodType[];
}
declare const sd: {
    /**
     * @param {object} thisArg
     * @param {object} handler
     * */
    property<T>(thisArg: T, handler: IHandler<T>): void;
    /**
     * @param {function} clazz
     * @param {object} handler
     * */
    method<T_1>(clazz: T_1, handler: IHandlerMethod): void;
};
export default sd;
//# sourceMappingURL=sd.d.ts.map