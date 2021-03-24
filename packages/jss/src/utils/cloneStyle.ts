import {JssStyle} from '../types'

const plainObjectConstrurctor = {}.constructor

export default function cloneStyle(style: JssStyle): JssStyle {
  if (!style || typeof style !== 'object') return style
  if (Array.isArray(style)) {
    /** @todo we need to improve JssStyle */
    //@ts-ignore
    return style.map(cloneStyle)
  }
  if (style.constructor !== plainObjectConstrurctor) return style

  const newStyle: JssStyle = {}
  for (const name in style) {
    /** @todo help needed */
    //@ts-ignore
    newStyle[name] = cloneStyle(style[name])
  }
  return newStyle
}
