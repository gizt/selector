/**
 * @module
 */
const NODES = require('./nodes')

/**
 * GRAMMAR
 * -------
 * 
 * selector = prefix suffix*
 * prefix   = ( name | array | "")
 * suffix   = array | propery
 * propery  = "." name
 * name  = "*" (ID "*")? | ID "*"?
 * array = "[" index "]"
 * index = DIGIT (":" (DIGIT))
 *       | ":" DIGIT
 */

 /**
  * 
  */
const TOKENS = {
  DIGIT: /-?[0-9]/,
  SYMBOL: /[\[\]\*\.\:]/,
  ID: /[^\[\]\.\*\:]+/,
  // ARRAY: /\[(?:(\d+)(?:\:?(\d+)?)?|\:(\d+))?\]/,
}

// create non-capturing group
const REGEX = new RegExp('(?:' + Object.values(TOKENS).map(r => r.source).join('|') + ')', "g")

/**
 * Tokenize input string and return array of tokens
 * 
 * @param {string} input 
 * @return {Object[]}
 * @example
 * 
 * tokenize('user.name') // return [{ type: 'ID', value: 'user'} ... ]
 */
function tokenize(input) {
  let r, tokens = [], syms = ['.', '[', ']', '*', ':']

  while(r = REGEX.exec(input)) {
    let token = r[0], type = 'ID'
    if (syms.indexOf(token) > -1) {
      type = token // 'SYMBOL'
    }
    else if (!isNaN(token)) {
      type = 'DIGIT'
      token *= 1 // cast to number
    }

    tokens.push({ value: token, type })
  }

  tokens.push({ type: 'EOL' })
  return tokens
}
function accept(type, tokens, advance = true) {
  let token = tokens[0]
  return type === (token && token.type) ? (advance ? tokens.shift() : tokens[0]) : false
}
function expect(type, tokens) {
  let token = tokens[0]
  if (!accept(type, tokens)) {
    throw new Error(`Expected token ${type} but got ${token.type + (token.value && token.value != token.type ? '(' + token.value + ')' : '')}`)
  }

  return token
}

/**
 * Parse tokens and returns AST
 *  
 * @param {Object[]} tokens 
 * @param {Object} object 
 */
function parse(tokens, object) {
  let ast = parseSelector(tokens, object)
  expect('EOL', tokens)

  return ast
}
function parseSelector(tokens, object) {
  let prefix = accept('[', tokens, false) ? parseArray(tokens) : parseName(tokens)

  // parse suffixes
  let n, suffixes = []
  while(n = parseSuffix(tokens)) {
    suffixes.push(n)
  }

  return NODES[NODES.selector](prefix, suffixes)
}

function parseName(tokens) {
  let token, all = end = false
  let start = accept('*', tokens) ? true : false

  token = accept('ID', tokens)
  if (token) {
    end = accept('*', tokens) ? true : false
  }

  // match all wildcard `*`
  all = start && !token
  let wildcard = all || start || end ? { all, start, end } : false

  // if it's not star `*`, must have `ID`
  if (!all && !token) expect('ID', tokens)

  return NODES[NODES.name](token, wildcard)
}

function parseArray(tokens) {
  let start = end = slice = single = false

  expect('[', tokens)

  // DIGIT (: (DIGIT))
  if (start = accept('DIGIT', tokens)) {
    if (slice = accept(':', tokens)) {
      end = accept('DIGIT', tokens)
    }
  }

  // : DIGIT
  else if (slice = accept(':', tokens)) {
    end = expect('DIGIT', tokens) 
  }

  expect(']', tokens)
  single = start && !slice

  return NODES[NODES.array](start, slice, end, single)
}

function parseSuffix(tokens) {
  // [] array
  if (accept('[', tokens, false)) {
    return parseArray(tokens)
  }

  // "." property
  else if (accept('.', tokens)) {
    let name = parseName(tokens)
    return NODES[NODES.property](name)
  }
}

module.exports = { parse, tokenize }