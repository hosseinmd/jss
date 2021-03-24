import toCss from '../utils/toCss'
import {JssStyle, RuleOptions, ToCssOptions, CSSKeyframeRule, ContainerRule} from '../types'
import {BaseStyleRule} from './styleRule'

export class KeyframeRule extends BaseStyleRule {
  renderable?: CSSKeyframeRule

  /**
   * Generates a CSS string.
   */
  toString(options?: ToCssOptions): string {
    const {sheet} = this.options
    const link = sheet ? sheet.options.link : false
    const opts = link ? {...options, allowEmpty: true} : options
    return toCss(this.key, this.style, opts)
  }
}

export default {
  onCreateRule(key: string, style: JssStyle, options: RuleOptions): KeyframeRule | null {
    if (options.parent && (options.parent as ContainerRule).type === 'keyframes') {
      return new KeyframeRule(key, style, options)
    }
    return null
  }
}
