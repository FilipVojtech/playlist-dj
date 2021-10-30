import { Options } from '@mikro-orm/core'

export default {
    entities: ['./dist/entities'],
    entitiesTs: ['./src/entities'],
    dbName: 'playlist-dj',
    type: 'mongo',
    clientUrl: process.env.PRODUCTION ? 'mongodb://database:27017/' : 'mongodb://localhost:27017/',
} as Options
