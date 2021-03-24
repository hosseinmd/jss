const escapeRegex = /([[\].#*$><+~=|^:(),"'`\s])/g
const nativeEscape = typeof CSS !== 'undefined' && CSS.escape

export default (str: string) =>
  nativeEscape ? nativeEscape(str) : str.replace(escapeRegex, '\\$1')
