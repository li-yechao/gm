import { Module } from '@nestjs/common'
import { Config } from '../config'
import { ProxyController } from './proxy.controller'
import { ProxyService } from './proxy.service'

@Module({
  controllers: [ProxyController],
  providers: [Config, ProxyService],
})
export class ProxyModule {}
