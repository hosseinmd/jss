import isInBrowser from 'is-in-browser'
import StyleSheet from './StyleSheet'
import PluginsRegistry from './PluginsRegistry'
import sheets from './sheets'
import {plugins as internalPlugins} from './plugins/index'
import createGenerateIdDefault from './utils/createGenerateId'
import createRule from './utils/createRule'
import DomRenderer from './DomRenderer'
import {
  Rule,
  RuleFactoryOptions,
  RuleOptions,
  StyleSheetFactoryOptions,
  Plugin,
  JssOptions,
  InternalJssOptions,
  JssStyle,
  JssStyles,
  Styles
} from './types'
import {GenerateId} from './utils/createGenerateId'

let instanceCounter = 0

export default class Jss {
  id: number = instanceCounter++

  version: string | void = process.env.VERSION

  plugins: PluginsRegistry = new PluginsRegistry()

  options: InternalJssOptions = {
    id: {minify: false},
    createGenerateId: createGenerateIdDefault,
    /** @todo Incompatible type */
    //@ts-ignore
    Renderer: isInBrowser ? DomRenderer : null,
    plugins: []
  }

  generateId: GenerateId = createGenerateIdDefault({minify: false})

  constructor(options?: JssOptions) {
    for (let i = 0; i < internalPlugins.length; i++) {
      this.plugins.use(internalPlugins[i] as Plugin, {queue: 'internal'})
    }
    this.setup(options)
  }

  /**
   * Prepares various options, applies plugins.
   * Should not be used twice on the same instance, because there is no plugins
   * deduplication logic.
   */
  setup(options: JssOptions = {}): this {
    if (options.createGenerateId) {
      this.options.createGenerateId = options.createGenerateId
    }

    if (options.id) {
      this.options.id = {
        ...this.options.id,
        ...options.id
      }
    }

    if (options.createGenerateId || options.id) {
      this.generateId = this.options.createGenerateId(this.options.id)
    }

    if (options.insertionPoint != null) this.options.insertionPoint = options.insertionPoint
    if ('Renderer' in options) {
      this.options.Renderer = options.Renderer
    }

    // eslint-disable-next-line prefer-spread
    if (options.plugins) this.use.apply(this, options.plugins)

    return this
  }

  /**
   * Create a Style Sheet.
   */
  createStyleSheet<Name extends string | number | symbol>(
    styles: Partial<Styles<Name, any, undefined>>,
    options?: StyleSheetFactoryOptions
  ): StyleSheet<Name> {
    let {index} = options || {}
    if (typeof index !== 'number') {
      index = sheets.index === 0 ? 0 : sheets.index + 1
    }

    const sheet = new StyleSheet(styles as any, {
      ...options,
      jss: this,
      generateId: options?.generateId || this.generateId,
      insertionPoint: this.options.insertionPoint,
      Renderer: this.options.Renderer,
      index
    })
    this.plugins.onProcessSheet(sheet)

    return sheet
  }

  /**
   * Detach the Style Sheet and remove it from the registry.
   */
  removeStyleSheet(sheet: StyleSheet): this {
    sheet.detach()
    sheets.remove(sheet)
    return this
  }

  /**
   * Create a rule without a Style Sheet.
   * [Deprecated] will be removed in the next major version.
   */
  createRule(
    name: string | undefined,
    style: JssStyle = {},
    options: RuleFactoryOptions = {}
  ): Rule | null {
    // Enable rule without name for inline styles.
    if (typeof name === 'object') {
      // $FlowFixMe[incompatible-call]
      /** @todo incompatible-call  */
      //@ts-ignore
      return this.createRule(undefined, name, style)
    }

    // $FlowFixMe[incompatible-type]
    const ruleOptions = {
      ...options,
      name,
      jss: this,
      Renderer: this.options.Renderer
    } as RuleOptions

    if (!ruleOptions.generateId) ruleOptions.generateId = this.generateId
    if (!ruleOptions.classes) ruleOptions.classes = {}
    if (!ruleOptions.keyframes) ruleOptions.keyframes = {}

    const rule = createRule(name, style, ruleOptions)

    if (rule) this.plugins.onProcessRule(rule)

    return rule
  }

  /**
   * Register plugin. Passed function will be invoked with a rule instance.
   */
  use(...plugins: Plugin[]): this {
    plugins.forEach(plugin => {
      this.plugins.use(plugin)
    })

    return this
  }
}
