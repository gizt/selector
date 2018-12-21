import { Node } from './nodes'
import { tokenize, parse } from './parser'

interface State {
  expand: Boolean,
  prev: Object
}

/**
 * @class
 */
const Visitors = {

  /**
   * Visit `selector` node
   * 
   * @param {Object} node 
   * @param {Object|Array} ctx 
   * @param {State} state 
   */
  selector(node: Node, ctx, state) {
    ctx = traverse(node.prefix, ctx, state)
    state.prev = node.prefix

    return suffixes(node.suffixes, ctx, state)
  },
  /* { token: Token, wildcard: {}} */
  name(node: Node, ctx, state) {
    return wildcard(node, state)(ctx)
  },
  // { start, slice, end }
  array(node: Node, ctx, state) {
    if (!Array.isArray(ctx)) return

    // flatten result
    if (state.expand) {
      ctx = flatten(ctx)
      state.expand = !state.expand
    }

    let start = node.start && node.start.value || 0
    let end = node.end && node.end.value || ctx.length

    // slice always returns array `[...]`
    if (node.slice) {
      return ctx.slice(start, end)
    }
    
    // specific element e.g. `a[1]`
    if (node.start) {
      return ctx[start]
    }

    // all elements e.g. `a[]`
    return ctx
  },
  property(node: Node, ctx, state) {

    // select many properties from array e.g. `users[].name` but not `users[1].name`
    let prev = state.prev
    if (prev.type === 'array' && !prev.single || state.expand) {
      // toggle `expand` state
      state.expand = !state.expand
      ctx = ctx
        .map(wildcard(node.name, state))
        .filter(v => v !== undefined)

      // flatten
      return node.name.wildcard ? flatten(ctx) : ctx
    }
    
    // select simple name e.g. `user.name`
    return this.name(node.name, ctx, state)
  },
}

const suffixes = (nodes: Node[], ctx, state) => {
  return (nodes || []).reduce((ctx, node, i) => {
    // get previous node first, if failed (at `0` index) use parent node as `prev`
    state.prev = nodes[i - 1] || state.prev
    return traverse(node, ctx, state)
  }, ctx)
}

const wildcard = (node: Node, state) => ctx => {

  // wildcard e.g. `*name` will match `username`, `firstname`
  let nodeKey = node.token.value
  if (node.wildcard) {

    // set `expand` flag
    state.expand = true
    let keys = Object.keys(ctx)
    let { start, end, all } = node.wildcard

    let r = keys
      .filter(k => {
        if (all) return true
        else if (start && end) return k.indexOf(nodeKey) > -1
        else if (start) return k.substr(k.length - nodeKey.length) === nodeKey
        else if (end)   return k.substr(0, nodeKey.length) === nodeKey
        else return false
      })
      .map(k => ctx[k])

    return r
  }
  else {
    return ctx[node.token.value]
  }
}

const flatten = xs => xs.reduce((a, b) => a.concat(b), [])

/**
 * Traverse AST and perform selection against given context
 * 
 * @param {Object} node      AST nodes
 * @param {Object|Array} ctx Context to perform selection
 * @param {State} state      Visitor's state
 */
function traverse(node: Node, ctx, state: State) {
  state = state || { expand: false, prev: null }
  if (node.type in Visitors) {
    return Visitors[node.type](node, ctx, state)
  }

  throw new Error(`Invalid node ${node.type}`)
}

export default (selector, data) => traverse(parse(tokenize(selector)), data, { expand: false, prev: null })
  