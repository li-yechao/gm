import { Injectable } from '@nestjs/common'
import { createHash } from 'crypto'
import { createWriteStream, existsSync, mkdirSync } from 'fs'
import gm from 'gm'
import fetch from 'node-fetch'
import { join } from 'path'
import { pipeline } from 'stream/promises'
import { Config } from '../config'

export type ProxyAction =
  | { action: 'autoOrient' }
  | { action: 'resize'; width: number; height?: number; mode?: gm.ResizeOption }
  | { action: 'quality'; quality: number }
  | { action: 'format'; format: string }

@Injectable()
export class ProxyService {
  constructor(private readonly config: Config) {}

  async proxy({ src, actions }: { src: string; actions?: ProxyAction[] }): Promise<string> {
    const source = await this.downloadSourceFile({ src })

    if (!actions?.length) {
      return source
    }

    const hash = createHash('md5').update(src).update(JSON.stringify(actions)).digest('hex')
    const dir = join(this.config.static.rootDir, '_cache', hash.slice(0, 2))
    const path = join(dir, hash)

    if (existsSync(path)) {
      return path
    }

    mkdirSync(dir, { recursive: true })

    const state = gm(source)

    for (const action of actions) {
      switch (action.action) {
        case 'autoOrient':
          state.autoOrient()
          break
        case 'resize':
          state.resize(action.width, action.height, action.mode)
          break
        case 'quality':
          state.quality(action.quality)
          break
        case 'format':
          state.setFormat(action.format)
          break
      }
    }

    await new Promise<void>((resolve, reject) =>
      state.write(path, err => (err ? reject(err) : resolve()))
    )

    return path
  }

  private async downloadSourceFile({ src }: { src: string }): Promise<string> {
    const hash = createHash('md5').update(src).digest('hex')
    const dir = join(this.config.static.rootDir, hash.slice(0, 2))
    const path = join(dir, hash)

    if (!existsSync(path)) {
      mkdirSync(dir, { recursive: true })
      await pipeline((await fetch(src)).body, createWriteStream(path))
    }

    return path
  }
}
