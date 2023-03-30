import { Options } from '@mikro-orm/core'

export default {
    entities: ['./dist/entities'],
    entitiesTs: ['./src/entities'],
    type: 'mongo',
    dbName: 'playlistdj',
    clientUrl: 'mongodb+srv://pdj_localhost:YNijVyuWSNUkUHzZ@cluster0.bmc18.mongodb.net/?retryWrites=true&w=majority',
} as Options
