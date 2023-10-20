import { DynamicModule, Global, Module } from "@nestjs/common";

const CONFIG = [{
    provide: 'Config',
    useValue: {baseUrl: '/api'}
}]

@Global()
@Module({
    providers: CONFIG,
    exports: CONFIG,
})

export class ConfigModule {
    // 动态模块
    static forRoot():DynamicModule{
        return {
            module: ConfigModule,
        }
    }
}
