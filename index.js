const isArrowFnWithParensRegex = /^\([^)]*\) *=>/
const isArrowFnWithoutParensRegex = /^[^=]*=>/

const stringifyFunction = Function.prototype.toString
const toJayString = Symbol('toJayString')

const stringify = {
  string: (s) => JSON.stringify(s),
  number: (n) => String(n),
  boolean: (b) => String(b),
  undefined: () => 'undefined',

  array: (array) => '[' + array.map(jaystring).join(',') + ']',

  date: (date) => `new Date(${date.getTime()})`,

  function: (func) => {
    const stringified = stringifyFunction.call(func)
    if (func.prototype) return stringified // normal function
    if (
      isArrowFnWithParensRegex.test(stringified) ||
      isArrowFnWithoutParensRegex.test(stringified)
    )
      return stringified // Arrow function

    // Shortened ES6 object method declaration
    return 'function ' + stringified
  },

  object: (obj) => {
    if (obj === null) return 'null'
    if (Array.isArray(obj)) return stringify.array(obj)
    if (obj instanceof Date) return stringify.date(obj)
    if (obj instanceof RegExp) return String(obj)

    const props = []
    for (const key in obj) {
      props.push([JSON.stringify(key), jaystring(obj[key])])
    }

    return '{' + props.map(([key, value]) => `${key}:${value}`).join(',') + '}'
  },

  symbol: (symbol) => `Symbol(${JSON.stringify(symbol.description)})`,
}

function jaystring(item) {
  if (item != null && typeof item[toJayString] === 'function') {
    const compiled = item[toJayString]()
    if (typeof compiled !== 'string')
      throw new Error('Expected item[toJayString]() to return evaluatable stringified item')
    return compiled
  }

  const type = typeof item
  const toString = stringify.hasOwnProperty(type) ? stringify[type] : null
  if (!toString) throw new Error(`Cannot stringify ${item} - unknown type ${typeof item}`)
  return toString(item)
}

jaystring.toJayString = toJayString
module.exports = jaystring
