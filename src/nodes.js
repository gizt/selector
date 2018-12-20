/**
 * @module
 */
const selector = Symbol('selector')
const property = Symbol('property')
const prefix   = Symbol('prefix')
const suffix   = Symbol('suffix')
const array    = Symbol('array')
const name     = Symbol('name')

module.exports = {
  selector,
  prefix,
  suffix,
  name,
  array,
  property,

  // create new nodes
  [selector]: (prefix, suffixes) => {
    return { type: 'selector', prefix, suffixes }
  },
  [name]: (token, wildcard) => {
    return { type: 'name', token, wildcard }
  },
  [array]: (start, slice, end, single) => {
    return { type: 'array', start, slice, end, single }
  },
  [property]: name => {
    return { type: 'property', name }
  }
}