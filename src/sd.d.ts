declare module "sd" {
    type ThisArgType<T> = T;
    type IDecorator<T> = (thisArgs: ThisArgType<T>, property: string, ...args: unknown[]) => unknown;
    type IDecoratorType<T> = IDecorator<T>;
    interface IHandler<T> {
        [property: string]: IDecoratorType<T> | IDecoratorType<T>[];
    }
    const sd: {
        property<T>(thisArg: T, handler: IHandler<T>): void;
        method<T_1>(clazz: T_1, handler: IHandler<T_1>): void;
    };
    export default sd;
}
//# sourceMappingURL=sd.d.ts.map