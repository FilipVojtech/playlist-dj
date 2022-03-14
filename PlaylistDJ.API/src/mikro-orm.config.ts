import { Options } from '@mikro-orm/core'

export default {
    entities: ['./dist/entities'],
    entitiesTs: ['./src/entities'],
    type: 'mongo',
    dbName: '',
    clientUrl: '',
} as Options
