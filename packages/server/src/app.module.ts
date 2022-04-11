import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Config } from './config'
import { ProxyModule } from './proxy/proxy.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ProxyModule,
  ],
  controllers: [],
  providers: [Config],
})
export class AppModule {}
