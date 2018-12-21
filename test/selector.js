const select = require('../')

const object = {
  a: {
    b: {
      c: {
        d: "Test",
        e: [
          { name: 'John', friends: { a: 1 } },
          { name: 'Joe', friends: [{ name: "C"}] },
          { name: 'Jay', friends: [{ name: "A" }, { name: "B" }] },
        ]
      }
    }
  },
  username: "John"
}

const object2 = {
  a: [
    { name: 'Doe', cards: { name: 'c1' }, friends: [{ name: "A"}], fries: { a: 2 } },
    { name: 'Joe', cards: { name: 'c2' }, friends: [{ name: "B", others: [{ name: "Z"}] }] },
    { name: 'Jay', cards: { name: 'c3' }, friends: [
      { name: "C1", others: [{ name: "Y"}] },
      { name: "C2", others: [{ name: "X" }] }
    ]},
  ]
}

const array = [
  [
    [1, 2], [3, 4]
  ],
  [
    [5, 6], [7, 8], [9, 10]
  ],
]
const array2 = [
  { name: 'a'}, { name: 'b'}, { name: 'c'}
]

describe('Selector', () => {
  const run = (title, selectors) => {
    selectors.map(s => {
      let [k, ctx, f] = s
      let r = select(k, ctx)
      it(`${title} ${k}`, () => {
        expect(r).toEqual(f(ctx))
      })
    })
  }

  const tests = [
    {
      title: 'wildcard name/property selector',
      selectors: [
        // [ selector, context, expect ]
        ['*', object, o => [o.a, o.username]],
        ['a[0].fri*', object2, o => [o.a[0].friends, o.a[0].fries]],
        ['a[0].fri*.a', object2, o => [o.a[0].fries.a]],
        ['a[].card*.name', object2, o => ['c1', 'c2', 'c3']],
        ['a[].*ards.name', object2, o => ['c1', 'c2', 'c3']],
        ['a[].*ard*.name', object2, o => ['c1', 'c2', 'c3']],
        ['a[].*a*', object2, o => [
          o.a[0].name, o.a[0].cards, o.a[1].name, o.a[1].cards, o.a[2].name, o.a[2].cards
        ]],
      ]
    },
    {
      title: 'name/property selector',
      selectors: [
        // [ selector, context, expect ]
        ['a', object, o => o.a],
        ['a.b.c.d', object, o => o.a.b.c.d],
        ['a.b.c.e', object, o => o.a.b.c.e],
        ['a.b.c.e[]', object, o => o.a.b.c.e],

        // property selector from array result
        ['a.b.c.e[].name', object, o => ['John', 'Joe', 'Jay']],
        ['[].name', array2, o => o.map(k => k.name)],
        ['a[].friends', object2, o => o.a.map(k => k.friends) ],

        // returns ["c1", "c2", "c3"]
        ['a[].cards.name', object2, o => o.a.map(k => k.cards).map(k => k.name)],
        ['a[].friends[].name', object2, o => ['A', 'B', 'C1', 'C2']],
      ]
    },

    {
      title: 'Array selector',
      selectors: [
        // [ selector, context, expect ]
        [ 'a', object2, o => o.a ],
        [ "a[]", object2, o => o.a ],
        [ "a[1]", object2, o => o.a[1] ],
        [ "a[1:]", object2, o => o.a.slice(1) ],
        [ "a[-1:]", object2, o => o.a.slice(-1) ],
        [ "a[:1]", object2, o => o.a.slice(0, 1) ],
        [ "a[:-1]", object2, o => o.a.slice(0, -1) ],

        // array
        [ '[]', array, o => o ],
        [ '[0]', array, o => o[0] ],
        [ '[1:]', array, o => o.slice(1) ],
        [ '[1][1]', array, o => o[1][1] ],
        [ '[1][1:][0]', array, o => o[1].slice(1)[0] ],
      ]
    }
  ]

  tests.map(c => run(c.title, c.selectors))
})