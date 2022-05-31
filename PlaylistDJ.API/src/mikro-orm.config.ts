import { Options } from '@mikro-orm/core'

export default {
    entities: ['./dist/entities'],
    entitiesTs: ['./src/entities'],
    type: 'mongo',
    dbName: 'playlistdj',
    clientUrl: 'mongodb://playlistdj:X2ztNWurducb2ChXkHYqxp3n@37.235.104.11:27017/',
} as Options
