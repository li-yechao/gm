// Copyright 2022 LiYechao
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
