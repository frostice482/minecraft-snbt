{
    const nbt = require('prismarine-nbt')
    
    const byteMax = 0x7f,
        shortMax = 0x7fff,
        intMax = 0x7fffffff,
        longMax = 0x7fffffffffffffffn

    function validateRange(v, min, max) {
        if (min <= v && v <= max) return v
        throw RangeError('Expecting [' + min + ', ' + max + '], got ' + v)
    }
}

Value = NBTNumber / Bool / ByteArray / ShortArray / IntArray / LongArray / List / Compound / StringNBT

Bool = v:Boolean { return nbt.byte(v === 'true' ? 1 : 0) }

NBTNumber = v:Number t:[BbSsIiLlFfDd]? {
	let d
    switch (t?.toLowerCase()) {
        case undefined: {
            d = v.includes('.') ? ['double', +v, Number.MAX_VALUE] : ['int', parseInt(v), intMax]
            break
        }
        
        case 'b': d = ['byte', parseInt(v), byteMax]; break
        case 's': d = ['short', parseInt(v), shortMax]; break
        case 'i': d = ['int', parseInt(v), intMax]; break
        case 'l': d = ['long', BigInt(v), longMax]; break
        case 'f': d = ['float', Math.fround(v), Number.MAX_VALUE]; break
        case 'd': d = ['double', +v, Number.MAX_VALUE]; break
    }
    const [type, value, max] = d
    return nbt[type](value, ~max, max)
}

ByteArrayContent = v:Num_DigitNeg [Bb] { return validateRange(+v, ~byteMax, byteMax) }
ShortArrayContent = v:Num_DigitNeg [Ss] { return validateRange(+v, ~shortMax, shortMax) }
IntArrayContent = v:Num_DigitNeg [Ii]? { return validateRange(+v, ~intMax, intMax) }
LongArrayContent = v:Num_DigitNeg [Ll] { return validateRange(BigInt(v), ~longMax, longMax) }

ByteArray = '[' _ 'B' _ ';' _ l:( v:ByteArrayContent _ NextList? { return v } )* ']' { return nbt.byteArray(l) }
ShortArray = '[' _ 'S' _ ';' _ l:( v:ShortArrayContent _ NextList? { return v } )* ']' { return nbt.shortArray(l) }
IntArray = '[' _ 'I' _ ';' _ l:( v:IntArrayContent _ NextList? { return v } )* ']' { return nbt.intArray(l) }
LongArray = '[' _ 'L' _ ';' _ l:( v:LongArrayContent _ NextList? { return v } )* ']' { return nbt.longArray(l) }

StringNBT = v:String { return nbt.string(v) }

List = '[' _ l:( v:Value _ NextList? { return v } )* ']' {
    const listType = l[0]?.type
    const vlist = []

    for (const [i, {type, value}] of l.entries()) {
    	if (type !== listType) throw new TypeError(`${i}: Expecting type ${listType}, got ${type}`)
        vlist.push(value)
    }

	return nbt.list({
    	type: listType ?? 'byte',
        value: vlist
    })
}
Compound = '{' _ l:( k:CompoundKey _ ':' _ v:Value _ NextList? { return [k, v] } )* '}' { return nbt.comp(Object.fromEntries(l)) }
CompoundKey = $[a-zA-Z0-9\_\-\.\+]+ / String

NextList = ',' _

// String
String = m:(StringSingleQuote / StringDoubleQuote) { return m[1].join('') }

StringSingleQuote = "'" (StringBodyEscape / "\\'" { return "'" } / [^\\'])* "'"
StringDoubleQuote = '"' (StringBodyEscape / '\\"' { return '"' } / [^\\"])* '"'
StringBodyEscape = $( '\\' ([rntvf\\0] / 'u' Hex Hex Hex Hex / 'x' Hex Hex) )

// Number
Number = $( '-'? (Num_Digit Num_Decimal? / Num_Digit? Num_Decimal) Num_Exp? )

Num_Digit = $[0-9]+
Num_DigitNeg = $( '-'? Num_Digit )
Num_Decimal = $( '.' Num_Digit )
Num_Exp = $( 'e' Num_DigitNeg )

// Other
Hex = [0-9a-f]
Boolean = "true" / "false"
_ = [ \t\n\r]*