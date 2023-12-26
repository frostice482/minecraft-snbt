import { Tags, TagType } from 'prismarine-nbt'

const compoundNameUnquoted = /^[a-zA-Z0-9_\-\.\+]+$/

const typeArrayCharMap = {
    [TagType.ByteArray]: {charUp: 'B', charDown: 'b'},
    [TagType.ShortArray]: {charUp: 'S', charDown: 's'},
    [TagType.IntArray]: {charUp: 'I', charDown: 'i'},
    [TagType.LongArray]: {charUp: 'L', charDown: 'l'},
}
Object.setPrototypeOf(typeArrayCharMap, null)

function stringifyInternal(data: Tags[TagType], space: string, level: number): string {
    const curspace = space ? '\n' + space.repeat(level) : ''
    
    switch (data.type) {
        case TagType.Byte: return data.value + 'b'
        case TagType.Short: return data.value + 's'
        case TagType.Int: return data.value + 'i'
        case TagType.Long: return data.value + 'l'
        case TagType.Float: return data.value + 'f'
        case TagType.Double: return data.value + 'd'
        case TagType.String: return JSON.stringify(data.value)

        case TagType.ByteArray: 
        case TagType.ShortArray: 
        case TagType.IntArray: 
        case TagType.LongArray: {
            const {charUp, charDown} = typeArrayCharMap[data.type]
            if (!data.value.length) return '[' + charUp + ';]'

            const nxtspace = curspace ? curspace + space : ''

            return '[' + charUp + ';'
                + nxtspace + data.value.join(charDown + ',' + nxtspace) + charDown
                + curspace + ']'
        }

        case TagType.List: {
            const { value: { type, value } } = data
            if (!value.length) return '[]'

            const nxtspace = curspace ? curspace + space : ''

            return '['
                + value.map( value => nxtspace + stringifyInternal({ type, value } as Tags[TagType], space, level + 1) )
                + curspace + ']'
        }

        case TagType.Compound: {
            const ent = Object.entries(data.value)
            if (!ent.length) return '{}'

            const nxtspace = curspace ? curspace + space : ''
            const kvsep = nxtspace ? ': ' : ':'

            return '{'
                + ent.map(([k, v]) =>
                    nxtspace + (compoundNameUnquoted.test(k) ? k : JSON.stringify(k))
                    + kvsep
                    + stringifyInternal(v as any, space, level + 1
                ))
                + curspace + '}'
        }
        
        default:
            //@ts-ignore
            throw new TypeError(`Unknown NBT type ${data.type}`)
    }
}

export function stringify(data: Tags[TagType], spaces: string | number = 0): string {
    if (typeof spaces === 'number') spaces = ' '.repeat(spaces)
    return stringifyInternal(data, spaces, 0)
}
