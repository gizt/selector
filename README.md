# @gizt/selector - Fast & Simple JSON Selector

[![](https://img.shields.io/npm/v/@gizt/selector.svg)](https://www.npmjs.com/package/@gizt/selector)
[![](https://img.shields.io/circleci/project/github/gizt/selector/master.svg)](https://circleci.com/gh/gizt/selector)
[![](https://img.shields.io/npm/dt/@gizt/selector.svg)](https://www.npmjs.com/package/@gizt/selector)

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
  title: 'Awesome',
  users: [
    {
      name: 'John', family: 'Doe', friends: [{ name: 'F1' }]
    },
    {
      name: 'Joe', family: 'Dae', friends: [{ name: 'F2' }]
    },
    ...
  ]
}

// Simple selector
select('users[].name', data) // ['John', 'Joe', ...]

// Nested array
select('users[].friends[].name', data) // ['F1', 'F2']

// Wildcard '*'
select('users[].*am*', data) // ['John', 'Doe', 'Joe', 'Dae']

// Array index & slice
select('users[1].name', data) // 'Joe'

// all elements start from index `1`
select('users[1:].name', data) // ['Joe', 'Ja', ...]

// first 2 elements
select('users[:2].name', data) // ['John', 'Joe']

```

For more example, please see `test` directory