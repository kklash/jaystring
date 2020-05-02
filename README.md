# jaystring
Recursively generate JavaScript code from existing objects.

## Usage

Convert an existing Javascript object recursively into a string. I made this utility when trying to build a JSON-Schema validator compiler for webpack, but found that almost any attempt to use custom formats or keywords when doing so resulted in ReferenceErrors due to lost scope.

I made this tool so that I could manually inject variables into the compiled module's scope.

```js
const jaystring = require('jaystring')
const object = {
  array: [1, 2, 3, true, false, () => 'foo'],
  observable: { next() { console.log('jokes lul') } },
  symbol: Symbol('symbol'),
  regex: /huzzah/,
}

console.log(jaystring(object))
// Prints:
// {"array":[1,2,3,true,false,() => 'foo'],"observable":{"next":function next() { console.log('jokes lul') }},"symbol":Symbol("symbol"),"regex":/huzzah/}
```

## Limitations

- Stringifying functions which reference external scope will result in code that throws ReferenceErrors.
- There are probably many common Browser and Node JS standard classes like Buffers or Uint8Arrays which I'm not handling here. That's just because I didn't need to spend the time implementing them. If you want them implemented, PRs are welcome!

## Custom Type Stringification

If you have types which `jaystring` doesn't understand, you can declare a `.toJayString()` method on their instances, which will be called when passed to `jaystring`. if `.toJayString()` doesn't return a string, the conversion will fail and throw an error.

Example:

```js
const jaystring = require('jaystring')

// window.URL class evaluative stringification
URL.prototype.toJayString = function() {
  return `new URL(${JSON.stringify(this)})`
}

console.log(jaystring(new URL('https://foo.com')))
// prints: new URL("https://foo.com/")
```
