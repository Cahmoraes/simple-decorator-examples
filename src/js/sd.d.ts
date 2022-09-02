declare type ThisArgType<T> = T;
declare type IDecorator<T> = (thisArgs: ThisArgType<T>, property: string, ...args: unknown[]) => unknown;
declare type IDecoratorType<T> = IDecorator<T>;
interface IHandler<T> {
    [property: string]: IDecoratorType<T> | IDecoratorType<T>[];
}
declare const sd: {
    property<T>(thisArg: T, handler: IHandler<T>): void;
    method<T_1>(clazz: T_1, handler: IHandler<T_1>): void;
};
export default sd;
//# sourceMappingURL=sd.d.ts.map