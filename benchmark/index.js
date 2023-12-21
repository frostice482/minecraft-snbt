const snbt = require('../dist')
const nbt = require('prismarine-nbt')
const fs = require('fs')

const snbtParsepath = require.resolve('../dist/parser-compiled.js')

function benchByTime(time, fn, log) {
    const t0 = performance.now(), te = t0 + time

    let i = 0
    while (performance.now() <= te) {
        fn()
        i++
    }

    const extra = performance.now() - te,
        total = performance.now() - t0

    if (log) console.log(log + ':', time + '+' + extra.toFixed(2) + 'ms', i + 'x', (i / total * 1000).toFixed(2) + ' ops')
    return i
}

;(async() => {
    const leveldata = await fs.promises.readFile(__dirname + '/level.dat')
    const levelnbt = await nbt.parse(leveldata).then(v => v.parsed)

    const serialized = snbt.stringify(levelnbt)
    const uncompressed = nbt.writeUncompressed(levelnbt)

    const time = 3000

    benchByTime(time, () => nbt.writeUncompressed(levelnbt), 'NBT write uncompressed')
    benchByTime(time, () => nbt.parseUncompressed(uncompressed), 'NBT parse uncompressed')
    benchByTime(time, () => snbt.stringify(levelnbt), 'SNBT stringify')
    benchByTime(time, () => snbt.parse(serialized), 'SNBT parse')
    benchByTime(time, () => {
        delete require.cache[snbtParsepath]
        require('../dist/parser-compiled.js')
    }, 'SNBT parser require')
})()
