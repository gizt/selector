const selector = Symbol('selector')
const property = Symbol('property')
const prefix   = Symbol('prefix')
const suffix   = Symbol('suffix')
const array    = Symbol('array')
const name     = Symbol('name')

export type Node = {
  type: string,
  [x: string]: any
}

export default {
  selector,
  prefix,
  suffix,
  name,
  array,
  property,

  [selector]: (prefix, suffixes): Node => {
    return { type: 'selector', prefix, suffixes }
  },
  [name]: (token, wildcard): Node => {
    return { type: 'name', token, wildcard }
  },
  [array]: (start, slice, end, single): Node => {
    return { type: 'array', start, slice, end, single }
  },
  [property]: (name): Node => {
    return { type: 'property', name }
  }
}