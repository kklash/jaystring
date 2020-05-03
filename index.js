const isArrowFnWithParensRegex = /^\([^)]*\) *=>/
const isArrowFnWithoutParensRegex = /^[^=]*=>/

const stringify = {
  string: JSON.stringify,
  number: String,
  boolean: String,
  undefined: () => 'undefined',

  array: (array) => '[' + array.map(jaystring).join(',') + ']',

  date: (date) => `new Date(${date.getTime()})`,

  function: (func) => {
    const stringified = func.toString()
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
    if (typeof obj.toJayString === 'function') {
      const compiled = obj.toJayString()
      if (typeof compiled !== 'string')
        throw new Error('Expected item.toJayString() to return evaluatable stringified item')
      return compiled
    }
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
  const toString = stringify[typeof item]
  if (!toString) throw new Error(`Cannot stringify ${item} - unknown type ${typeof item}`)
  return toString(item)
}

module.exports = jaystring
