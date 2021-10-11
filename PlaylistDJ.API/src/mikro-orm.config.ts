import { Options } from '@mikro-orm/core'

export default {
    entities: ['./dist/entities'],
    entitiesTs: ['./src/entities'],
    dbName: 'playlist-dj',
    type: 'mongo',
} as Options
