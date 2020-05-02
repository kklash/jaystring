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
