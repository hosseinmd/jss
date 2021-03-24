import {StylePropertyMap} from './cssom'

export type DOMString = string

export interface HTMLElementWithStyleMap extends HTMLElement {
  readonly attributeStyleMap?: StylePropertyMap
}
