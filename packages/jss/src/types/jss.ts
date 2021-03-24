import Jss from '../Jss'
import StyleSheet from '../StyleSheet'
import {ConditionalRule} from '../plugins/conditionalRule'
import {KeyframesRule} from '../plugins/keyframesRule'
import {StyleRule, BaseStyleRule} from '../plugins/styleRule'
import {ViewportRule} from '../plugins/viewportRule'
import {SimpleRule} from '../plugins/simpleRule'
import {FontFaceRule} from '../plugins/fontFaceRule'
import {CSSStyleRule, AnyCSSRule} from './cssom'
import {HTMLElementWithStyleMap} from './dom'
import RuleList from '../RuleList'
import {CreateGenerateId, CreateGenerateIdOptions, GenerateId} from '../utils/createGenerateId'
import {Properties as CSSProperties} from 'csstype'
// Observable support is included as a plugin.  Including it here allows
// TypeScript users to use Observables, which could be confusing if a user
// hasn't installed that plugin.
//
// TODO: refactor to only include Observable types if plugin is installed.
import {Observable} from 'indefinite-observable'

export {RuleList, StyleSheet}

export type KeyframesMap = Record<string, string>

export type ToCssOptions = {
  indent?: number
  allowEmpty?: boolean
  children?: boolean
}

export type UpdateOptions = {
  process?: boolean
  force?: boolean
}

export type UpdateArguments =
  | [Object]
  | [Object, UpdateOptions]
  | [string, Object]
  | [string, Object, UpdateOptions]

export interface BaseRule {
  type: string
  // Key is used as part of a class name and keyframes-name. It has to be
  // a valid CSS identifier https://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
  key: string
  isProcessed: boolean
  // eslint-disable-next-line no-use-before-define
  options: RuleOptions
  renderable?: Object | null | void
  toString(options?: ToCssOptions): string
}

export type Rule =
  | StyleRule
  | ConditionalRule
  | FontFaceRule
  | KeyframesRule
  | SimpleRule
  | ViewportRule
  | BaseRule

type Func<P, T, R> = T extends undefined ? ((data: P) => R) : ((data: P & {theme: T}) => R)

type NormalCssProperties = CSSProperties<string | number>
type NormalCssValues<K> = K extends keyof NormalCssProperties ? NormalCssProperties[K] : JssValue

export type JssStyle<Props = any, Theme = undefined> =
  | {
      [K in keyof NormalCssProperties]:
        | NormalCssValues<K>
        | JssStyle<Props, Theme>
        | Func<Props, Theme, NormalCssValues<K> | JssStyle<undefined, undefined> | undefined>
        | Observable<NormalCssValues<K> | JssStyle | undefined>
    }
  | {
      [K: string]:
        | JssValue
        | JssStyle<Props, Theme>
        | Func<Props, Theme, JssValue | JssStyle<undefined, undefined> | undefined>
        | Observable<JssValue | JssStyle | undefined>
    }

export type Styles<
  Name extends string | number | symbol = string,
  Props = unknown,
  Theme = undefined
> = Record<
  Name,
  | JssStyle<Props, Theme>
  | string
  | Func<Props, Theme, JssStyle<undefined, undefined> | string | null | undefined>
  | Observable<JssStyle | string | null | undefined>
>
export type Classes<Name extends string | number | symbol = string> = Record<Name, string>
export type Keyframes<Name extends string = string> = Record<Name, string>

export type JssValue =
  | (string & {})
  | (number & {})
  | Array<string | number | Array<string | number> | '!important'>
  | null
  | false

export type JssStyles = Record<string, JssStyle>

export interface Renderer {
  constructor(sheet?: StyleSheet): void
  // HTMLStyleElement needs fixing https://github.com/facebook/flow/issues/2696
  element: any
  setProperty(
    cssRule: HTMLElementWithStyleMap | CSSStyleRule,
    prop: string,
    value: JssValue
  ): boolean
  getPropertyValue(cssRule: HTMLElementWithStyleMap | CSSStyleRule, prop: string): string
  removeProperty(cssRule: HTMLElementWithStyleMap | CSSStyleRule, prop: string): void
  setSelector(cssRule: CSSStyleRule, selectorText: string): boolean
  attach(): void
  detach(): void
  deploy(): void
  insertRule(rule: Rule): false | CSSStyleSheet | AnyCSSRule
  deleteRule(cssRule: AnyCSSRule): boolean
  replaceRule(cssRule: AnyCSSRule, rule: Rule): false | CSSStyleSheet | AnyCSSRule
  indexOf(cssRule: AnyCSSRule): number
  getRules(): CSSRuleList | void
}

export type RuleFactoryOptions = {
  selector?: string
  classes?: Classes
  keyframes?: KeyframesMap
  sheet?: StyleSheet
  index?: number
  jss?: Jss
  generateId?: GenerateId
  Renderer?: Renderer | null
}

export interface ContainerRule extends BaseRule {
  at: string
  rules: RuleList
}

export type RuleOptions = {
  selector?: string
  scoped?: boolean
  sheet?: StyleSheet
  index?: number
  parent?: ContainerRule | StyleSheet
  classes: Classes
  keyframes: KeyframesMap
  jss: Jss
  generateId: GenerateId
  Renderer?: Renderer | null
  name?: string
}

export type RuleListOptions = {
  classes: Classes
  scoped?: boolean
  keyframes: KeyframesMap
  generateId: GenerateId
  Renderer?: Renderer | null
  jss: Jss
  sheet?: StyleSheet
  parent: ContainerRule | StyleSheet
  generateClassName?: GenerateId
}

export type OnCreateRule = (name: string, decl: JssStyle, options: RuleOptions) => BaseRule | null
export type OnProcessRule = (rule: Rule, sheet?: StyleSheet) => void
export type OnProcessStyle = (style: JssStyle, rule: Rule, sheet?: StyleSheet) => JssStyle
export type OnProcessSheet = (sheet?: StyleSheet) => void
export type OnChangeValue = (
  value: JssValue,
  prop: string,
  rule: StyleRule | BaseStyleRule
) => JssValue
export type OnUpdate = (
  data: Object,
  rule: Rule,
  sheet: StyleSheet | undefined,
  options: UpdateOptions
) => void

export type Plugin = {
  onCreateRule?: OnCreateRule
  onProcessRule?: OnProcessRule
  onProcessStyle?: OnProcessStyle
  onProcessSheet?: OnProcessSheet
  onChangeValue?: OnChangeValue
  onUpdate?: OnUpdate
}

export type InsertionPoint = string | HTMLElementWithStyleMap

export type JssOptions = {
  createGenerateId?: CreateGenerateId
  id?: CreateGenerateIdOptions
  plugins?: Array<Plugin>
  insertionPoint?: InsertionPoint
  Renderer?: Renderer | null
}

export type InternalJssOptions = {
  createGenerateId: CreateGenerateId
  plugins: Array<Plugin>
  id: CreateGenerateIdOptions
  insertionPoint?: InsertionPoint
  Renderer?: Renderer | null
}

export type StyleSheetFactoryOptions = {
  media?: string
  meta?: string
  index?: number
  link?: boolean
  element?: HTMLStyleElement
  generateId?: GenerateId
  classNamePrefix?: string
}

export type InternalStyleSheetOptions = {
  media?: string
  meta?: string
  link?: boolean
  element?: HTMLStyleElement
  index: number
  insertionPoint?: InsertionPoint
  Renderer?: Renderer | null
  generateId: GenerateId
  classNamePrefix?: string
  jss: Jss
  sheet: StyleSheet
  parent: ConditionalRule | KeyframesRule | StyleSheet
  classes: Classes
  keyframes: KeyframesMap
}

export type FixMeAny = any

export interface Renderer {
  setProperty(cssRule: HTMLElement | CSSStyleRule, prop: string, value: JssValue): boolean
  getPropertyValue(cssRule: HTMLElement | CSSStyleRule, prop: string): string
  removeProperty(cssRule: HTMLElement | CSSStyleRule, prop: string): void
  setSelector(cssRule: CSSStyleRule, selectorText: string): boolean
  attach(): void
  detach(): void
  deploy(sheet: StyleSheet): void
  insertRule(rule: Rule): false | CSSRule
  insertRule(
    rule: Rule,
    index?: number,
    nativeParent?: CSSStyleSheet | CSSMediaRule | CSSKeyframesRule
  ): false | CSSStyleSheet | AnyCSSRule
  deleteRule(cssRule: CSSRule): boolean
  replaceRule(cssRule: CSSRule, rule: Rule): false | CSSRule
  indexOf(cssRule: CSSRule): number
  getRules(): CSSRuleList | void
}

export interface StyleSheetOptions extends StyleSheetFactoryOptions {
  index: number
  generateId: GenerateId
  Renderer?: Renderer | null
  insertionPoint?: InsertionPoint
  jss: Jss
}

declare class SheetsRegistry {
  registry: StyleSheet[]
  readonly index: number
  add(sheet: StyleSheet): void
  reset(): void
  remove(sheet: StyleSheet): void
  toString(options?: ToCssOptions): string
}

declare class SheetsManager {
  readonly size: number
  get(key: object): StyleSheet | null
  add(key: object, sheet: StyleSheet): void
  manage(key: object): StyleSheet | null
  unmanage(key: object): void
}
