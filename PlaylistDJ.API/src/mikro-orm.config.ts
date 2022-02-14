import { Options } from '@mikro-orm/core'

export default {
    entities: ['./dist/entities'],
    entitiesTs: ['./src/entities'],
    dbName: 'playlist-dj',
    type: 'mongo',
    clientUrl: 'mongodb://127.0.0.1:27017/',
} as Options
