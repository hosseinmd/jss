import {DOMString} from './dom'

export interface StylePropertyMap {
  get(property: DOMString): DOMString
  set(property: DOMString, value: DOMString): DOMString
  delete(property: DOMString): void
}

export interface CSSRuleBase<T extends Record<string, any>> {
  readonly type: T['type']
  readonly CSSRule?: CSSRule
  readonly CSSStyleSheet?: CSSStyleSheet
  cssText: DOMString
  attributeStyleMap: StylePropertyMap
}

export interface CSSGroupingRule<T> extends CSSRuleBase<T> {
  // eslint-disable-next-line no-use-before-define
  readonly cssRules: CSSRuleList
  insertRule(rule: DOMString, index: number): number
  deleteRule(index: number): void
}

export interface CSSStyleRule extends CSSRuleBase<{type: 1 | 1}> {
  readonly type: 1
  readonly style: CSSStyleDeclaration
  selectorText: DOMString
}

export interface CSSCharsetRule extends CSSRuleBase<{type: 2 | 2}> {
  readonly type: 2
  charset: DOMString
}

export interface CSSImportRule extends CSSRuleBase<{type: 3 | 3}> {
  readonly type: 3
  readonly mediaList: {
    readonly mediaText: DOMString
    length: number
    item?: DOMString
    appendMedium(medium: DOMString): void
    deleteMedium(medium: DOMString): void
  }
}

export interface CSSMediaRule extends CSSGroupingRule<{type: 4 | 4}> {
  readonly type: 4
  readonly mediaList: {
    readonly mediaText: DOMString
    length: number
    item?: DOMString
    appendMedium(medium: DOMString): void
    deleteMedium(medium: DOMString): void
  }
}

export interface CSSFontFaceRule extends CSSRuleBase<{type: 5 | 5}> {
  readonly type: 5
  readonly style: CSSStyleDeclaration
}

export interface CSSKeyframeRule extends CSSRuleBase<{type: 8 | 8}> {
  readonly type: 8
  readonly style: CSSStyleDeclaration
  keyText: DOMString
}

export interface CSSKeyframesRule extends CSSRuleBase<{type: 7 | 7}> {
  readonly type: 7
  readonly cssRules: CSSRuleList
  name: DOMString
  appendRule(rule: DOMString): void
  deleteRule(key: DOMString): void
  findRule(key: DOMString): CSSKeyframeRule
}

export interface CSSNamespaceRule extends CSSRuleBase<{type: 10 | 10}> {
  readonly type: 10
  namespaceURI: DOMString
  prefix: DOMString
}

export interface CSSViewportRule extends CSSRuleBase<{type: 15 | 15}> {
  readonly type: 15
  readonly style: CSSStyleDeclaration
}

export type AnyCSSRule =
  | CSSMediaRule
  | CSSFontFaceRule
  | CSSKeyframesRule
  | CSSCharsetRule
  | CSSImportRule
  | CSSNamespaceRule
  | CSSStyleRule
  | CSSViewportRule
