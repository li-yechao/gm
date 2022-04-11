import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class Config {
  constructor(private readonly configService: ConfigService) {}

  get port() {
    return this.getInt('port', 8080)
  }

  get cors() {
    return this.getBoolean('cors', false)
  }

  get static() {
    return {
      rootDir: this.getString('static.rootDir'),
    }
  }

  private get(key: string): string | undefined {
    return this.configService.get<string>(key)?.trim() || undefined
  }

  private getString(key: string, d?: string): string {
    const s = this.get(key)
    if (!s) {
      if (d !== undefined) {
        return d
      }
      throw new Error(`Missing required config \`${key}\``)
    }
    return s
  }

  private getInt(key: string, d?: number): number {
    const s = this.get(key)
    if (!s) {
      if (d !== undefined) {
        return d
      }
      throw new Error(`Missing required config \`${key}\``)
    }
    try {
      if (!/^\d+$/.test(s)) {
        throw new Error('Invalid number')
      }
      const n = parseInt(s)
      if (!Number.isSafeInteger(n)) {
        throw new Error('Invalid int')
      }
      return n
    } catch (error) {
      throw new Error(`Invalid config ${key}, require \`number\``)
    }
  }

  private getBoolean(key: string, d?: boolean): boolean {
    const s = this.get(key)
    if (!s) {
      if (d !== undefined) {
        return d
      }
      throw new Error(`Missing required config \`${key}\``)
    }
    if (s === 'true') {
      return true
    }
    if (s === 'false') {
      return false
    }
    throw new Error(`Invalid config ${key}, require \`true\` or \`false\``)
  }
}
