  /* jshint evil: true */
const jaystring = require('.')

function test(itemString) {
  const item = eval(`(${itemString})`)

  let stringified
  try {
    stringified = jaystring(item)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }

  if (stringified !== itemString) {
    console.error(`Failed to stringify object:`)
    console.error(`input: ${itemString}`)
    console.error(`output: ${stringified}`)
    process.exit(1)
  }
}

const fixtures = [
  `{a:"b",c:true,d:42}`,
  'function foo() {}',
  '[true,() => "moo"]',
  // "{foo(){}}", Special case, cannot be tested but output should work
  '/regex/',
  'new Date(288482943)',
  `{x:function x(){},symbol:Symbol("x")}`,
]

fixtures.forEach(test)
