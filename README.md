# @gizt/selector - Fast & Simple JSON Selector

[![](https://img.shields.io/npm/v/@gizt/selector.svg)](https://www.npmjs.com/package/@gizt/selector)
[![](https://img.shields.io/circleci/project/github/gizt/selector/master.svg)](https://circleci.com/gh/gizt/selector)
[![](https://img.shields.io/npm/dt/@gizt/selector.svg)](https://www.npmjs.com/package/@gizt/selector)

`@gizt/selector` is a fast and intuitive JSON selector (the syntax is based on JSON notation and glob).

You can try it online here <a href="https://gizt.github.io/selector/">playground</a>

### Quick start

```sh
npm install @gizt/selector
```

### Usage
```js
// es6/browser
import select from '@gizt/selector'

// node
const select = require('@gizt/selector')
```

### Example
```js
let data = {
  "title": "Awesome",
  "users": [
    { "name": "John", "family": "Doe", "friends": [{ "name": "F1" }] },
    { "name": "Joe",  "family": "Dae", "friends": [{ "name": "F2" }] }
    ...
  ]
}
```
### Selectors
#### Simple selector
Simple property/name selector 
```js
// Property selector
select('users[].name', data) // ['John', 'Joe', ...]

// Nested array
select('users[].friends[].name', data) // ['F1', 'F2']
```
#### Wildcard selector
Support prefix, suffix, middle and star 

```js
// prefix
select('users[].na*', data)  // ['John', 'Joe']

// suffix
select('users[].*ly', data)  // ['Doe', 'Dae']

// middle
select('users[].*am*', data) // ['John', 'Doe', 'Joe', 'Dae']

// star
select('users[].friends[].*', data) // ['F1', 'F2']
```

#### Array selector
Array index & slice 

```js
// index
select('users[1].name', data) // 'Joe'

// all elements start from index `1` same as `data.slice(1)`
select('users[1:].name', data) // ['Joe', 'Ja', ...]

// first 2 elements same a `data.slice(0, 2)`
select('users[:2].name', data) // ['John', 'Joe']
```

### Array input
Also support array input 
```js
select('[].name', [ { name: 'a'}, { name: 'b' } ]) // ['a', 'b']
```

For more example, please see `test` directory