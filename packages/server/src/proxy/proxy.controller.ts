import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  Query,
  StreamableFile,
} from '@nestjs/common'
import { createReadStream } from 'fs'
import { ResizeOption } from 'gm'
import { ProxyAction, ProxyService } from './proxy.service'

@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get()
  async proxy(
    @Headers('accept') accept?: string,
    @Query('src') src?: string,
    @Query('autoOrient') autoOrient?: string,
    @Query('width') width?: string,
    @Query('resizeMode') resizeMode?: ResizeOption,
    @Query('quality') quality?: string,
    @Query('format') format?: string,
    @Query('webp') webp?: string
  ): Promise<StreamableFile> {
    if (!src) {
      throw new BadRequestException(`Missing required query src`)
    }

    const actions: ProxyAction[] = []

    if (autoOrient) {
      actions.push({ action: 'autoOrient' })
    }
    if (width) {
      const w = parseInt(width)
      if (w > 0) {
        actions.push({ action: 'resize', width: w, mode: resizeMode })
      }
    }
    if (quality) {
      const q = parseInt(quality)
      if (q > 0 && q < 100) {
        actions.push({ action: 'quality', quality: q })
      }
    }
    if (format) {
      actions.push({ action: 'format', format })
    } else if (webp && accept?.includes('webp')) {
      actions.push({ action: 'format', format: 'webp' })
    }

    const path = await this.proxyService.proxy({ src, actions })

    return new StreamableFile(createReadStream(path), {
      type: 'image/jpeg',
    })
  }
}
