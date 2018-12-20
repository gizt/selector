const { parse, tokenize } = require('../src/parser')

describe('Parser', () => {
  
  let tests = [
    {
      title: 'Create correct AST',
      tests: [
        ['test', {
          "prefix": {
            "token": {
              "type": "ID",
              "value": "test"
            },
            "type": "name",
            "wildcard": false
          },
          "suffixes": [],
          "type": "selector"
        }],

        ['a.b.c.d', {"prefix": {"token": {"type": "ID", "value": "a"}, "type": "name", "wildcard": false}, "suffixes": [{"name": {"token": {"type": "ID", "value": "b"}, "type": "name", "wildcard": false}, "type": "property"}, {"name": {"token": {"type": "ID", "value": "c"}, "type": "name", "wildcard": false}, "type": "property"}, {"name": {"token": {"type": "ID", "value": "d"}, "type": "name", "wildcard": false}, "type": "property"}], "type": "selector"}],
        ['a[]', {"prefix": {"token": {"type": "ID", "value": "a"}, "type": "name", "wildcard": false}, "suffixes": [{"end": false, "single": false, "slice": false, "start": false, "type": "array"}], "type": "selector"}],
        ['a[2]', {"prefix": {"token": {"type": "ID", "value": "a"}, "type": "name", "wildcard": false}, "suffixes": [{"end": false, "single": true, "slice": false, "start": {"type": "DIGIT", "value": 2}, "type": "array"}], "type": "selector"}],
        ['a[2:]', {"prefix": {"token": {"type": "ID", "value": "a"}, "type": "name", "wildcard": false}, "suffixes": [{"end": false, "single": false, "slice": {"type": ":", "value": ":"}, "start": {"type": "DIGIT", "value": 2}, "type": "array"}], "type": "selector"}],
        ['a[2:3]', {"prefix": {"token": {"type": "ID", "value": "a"}, "type": "name", "wildcard": false}, "suffixes": [{"end": {"type": "DIGIT", "value": 3}, "single": false, "slice": {"type": ":", "value": ":"}, "start": {"type": "DIGIT", "value": 2}, "type": "array"}], "type": "selector"}],
        ['a[:3]', {"prefix": {"token": {"type": "ID", "value": "a"}, "type": "name", "wildcard": false}, "suffixes": [{"end": {"type": "DIGIT", "value": 3}, "single": false, "slice": {"type": ":", "value": ":"}, "start": false, "type": "array"}], "type": "selector"}],
        ['a.b[1].kung', {"prefix": {"token": {"type": "ID", "value": "a"}, "type": "name", "wildcard": false}, "suffixes": [{"name": {"token": {"type": "ID", "value": "b"}, "type": "name", "wildcard": false}, "type": "property"}, {"end": false, "single": true, "slice": false, "start": {"type": "DIGIT", "value": 1}, "type": "array"}, {"name": {"token": {"type": "ID", "value": "kung"}, "type": "name", "wildcard": false}, "type": "property"}], "type": "selector"}],
        ['a.b[1][2:].kung', {"prefix": {"token": {"type": "ID", "value": "a"}, "type": "name", "wildcard": false}, "suffixes": [{"name": {"token": {"type": "ID", "value": "b"}, "type": "name", "wildcard": false}, "type": "property"}, {"end": false, "single": true, "slice": false, "start": {"type": "DIGIT", "value": 1}, "type": "array"}, {"end": false, "single": false, "slice": {"type": ":", "value": ":"}, "start": {"type": "DIGIT", "value": 2}, "type": "array"}, {"name": {"token": {"type": "ID", "value": "kung"}, "type": "name", "wildcard": false}, "type": "property"}], "type": "selector"}],
      ]
    },

    {
      title: 'accept valid filter',
      tests: [
        // object
        ['a'],
        ['a.b.c'],
        ['a.b.c'],
        ['a[]'],
        ['a.*[]'],

        // wildcard
        ['*'],
        ['*.*'],
        ['a*'],
        ['*a'],
        ['*a*'],
        ['*a.*b.*c'],
        ['a*.b*.c*'],
        ['*a*.*b*.*c*'],
        ['a*[]'],
        ['*a[]'],
        ['*a*[]'],

        // array
        ['[]'],
        ['[1]'],
        ['[-1]'],
        ['[1:]'],
        ['[-1:]'],
        ['[:1]'],
        ['[:-1]'],
        ['[1:1]'],
        ['[-1:-1]'],
        ['[][][]'],
        ['[].a'],
        ['[1].a'],
        ['[1].a'],
        ['[1].*'],
      ]
    },

    {
      title: 'reject invalid filter',
      tests: [
        ['a[', `Expected token ] but got EOL`],
        ['a[a', `Expected token ] but got ID(a)`],
        ['a.[', `Expected token ID but got [`],
        ['a.b]', `Expected token EOL but got ]`],
        ['a.b[]c', `Expected token EOL but got ID(c)`],
        ['a.b[1-2]', `Expected token ] but got DIGIT(-2)`],
        ['a.b[1:c]', `Expected token ] but got ID(c)`],
        ['a.b[c]', `Expected token ] but got ID(c)`],
        ['a.b[c:]', `Expected token ] but got ID(c)`],
        ['a.*[c:]', `Expected token ] but got ID(c)`],
        ['a.**', `Expected token EOL but got *`],
        ['a.b[]*', `Expected token EOL but got *`],
      ]
    }
  ]

  tests.map(t => it(t.title, () => {
    t.tests.map(test => {
      let [ selector, error ] = test
      let handler = () => parse(tokenize(selector))

      // test error
      if (typeof error === 'string') {
        expect(handler).toThrowError(error)
      }

      // test success
      else if (error == undefined) {
        expect(handler).not.toThrow()
      }

      // regular test
      else {
        expect(handler()).toEqual(error)
      }
    })
  }))
})