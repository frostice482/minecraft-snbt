import { Tags, TagType } from 'prismarine-nbt'

const compoundNameUnquoted = /^[a-zA-Z0-9_\-\.\+]+$/

export function stringify(data: Tags[TagType]): string {
    switch (data.type) {
        case TagType.Byte: return data.value + 'b'
        case TagType.Short: return data.value + 's'
        case TagType.Int: return data.value + 'i'
        case TagType.Long: return data.value + 'l'
        case TagType.Float: return data.value + 'f'
        case TagType.Double: return data.value + 'd'
        case TagType.String: return JSON.stringify(data.value)

        case TagType.ByteArray: return '[B;' + data.value.join('b,') + 'b]'
        //case TagType.ShortArray: return '[S;' + data.value.join('s,') + 's]'
        case TagType.IntArray: return '[I;' + data.value.join('i,') + 'i]'
        case TagType.LongArray: return '[L;' + data.value.join('l,') + 'l]'

        case TagType.List: return '['
            + data.value.value.map(
                v => stringify({ type: data.value.type, value: v } as Tags[TagType])
            )
        + ']'

        case TagType.Compound:
            return '{'
                + Object.entries(data.value)
                    .map(
                        ([k, v]) =>
                            (compoundNameUnquoted.test(k) ? k : JSON.stringify(k))
                            + ':'
                            + stringify(v as any
                        )
                    )
                    .join(',')
            + '}'
        
        default:
            throw new TypeError(`Unknown NBT type ${data.type}`)
    }
}
