# minecraft-snbt

A NodeJS module to handle parsing Minecraft SNBT to NBT and stringifying NBT to SNBT.

## Parse SNBT to NBT

To parse the SNBT, simply call `snbt.parse` function with the SNBT as its argument. It retrns [`prismarine-nbt`](https://www.npmjs.com/package/prismarine-nbt)'s tags.

```js
const snbt = require('minecraft-snbt');

// Expected value:
// { type: "compound", name: "", value: ... }
const myNBT = snbt.parse(`{
    byte: 1b,
    short: 1s,
    int_auto: 1,
    int: 1i,
    long: 1l,
    float: 1f,
    double_auto: 1.0,
    double: 1d,
    'string_single\\'': 'here\\\\\\'\\u0001\\r\\n\\t',
    "string_double\\\\\\"": "here\\\\\\"\\u0001\\r\\n\\t",
    list: [1s,2s,3s],
    bytearr: [B;1b,2b,3b],
    intarr: [I;1i,2i,3i],
    longarr: [L;1l,2l,3l]
}`);
```

This parser complies with the standard SNBT syntax, while also supports additional features:

- Whitespaces
- Missing / trailing comma in compound
- CR, LF, and TAB escapes in string

This parser uses [peggy.js](https://www.npmjs.com/package/peggy) grammar (located at `parser-grammar/parser-grammar.peggy`)
which is then precompiled and minified using [uglify-js](https://www.npmjs.com/package/uglify-js) to `src/parser-compiled.js`
after installing node packages.

## Stringify SNBT to NBT

To parse the SNBT, simply call `snbt.parse` function with the SNBT as its argument. It retrns SNBT string.

```js
// Expected value:
// '{byte:1b,short:1s,int_auto:1i,...}'
const mySNBT = snbt.stringify(myNBT);
```

SNBT can also be formatted to be readable by specifying a tab size / tab character to the function.

```js
// Expected value:
// '{\n'+
// '  byte: 1b,\n'+
// '  short: 1s,\n'+
// '  int_auto: 1i,\n'+
// ...
// '}'+
const mySNBT = snbt.stringify(myNBT, 2);
```
