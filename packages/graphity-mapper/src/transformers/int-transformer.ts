import { ValueTransformer } from '../interfaces/mapper'

export const intTransformer: ValueTransformer<any, number> = {
  to(source: any): number {
    if (source === null || typeof source === 'undefined') {
      return source
    }
    return parseInt(`${+source}`)
  },
}
