import { Tags, TagType } from 'prismarine-nbt'
const parser = require('./parser-compiled.js')

export const parse = parser as (input: string) => Tags[TagType]
