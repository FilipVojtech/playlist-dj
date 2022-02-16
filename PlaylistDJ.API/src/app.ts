import express, { Response } from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import session from 'express-session'
import { EntityManager, EntityRepository, MikroORM } from '@mikro-orm/core'
import dotenv from 'dotenv'
import { apiController, loginController } from './controllers'
import { Filter, Playlist, User } from './entities'
import config from './mikro-orm.config'
import { CookieTypes } from './Utility'
import { Request } from './global'
// @ts-ignore
import connect_mongodb_session from 'connect-mongodb-session'

// Set up .env
dotenv.config()

// Set up MongoDB session store
const MongoDBStore = connect_mongodb_session(session)
const store = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017/',
    databaseName: 'playlist-dj',
    collection: 'session',
})

// Initialize Express
const app = express()

// Define MikroORM types
export const DI = {} as {
    orm: MikroORM
    em: EntityManager
    filterRepository: EntityRepository<Filter>
    playlistRepository: EntityRepository<Playlist>
    userRepository: EntityRepository<User>
}

// Bootstrap the app
;(async () => {
    app.use(morgan('dev'))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser())
    app.use(
        session({
            store,
            saveUninitialized: true,
            rolling: true,
            resave: true,
            secret: process.env.PDJ_SESSION_SECRET as string,
            cookie: {
                secure: process.env.PRODUCITON === '1',
                maxAge: 1000 * 60 * 60 * 24,
            },
        })
    )

    DI.orm = await MikroORM.init(config)
    DI.em = DI.orm.em
    DI.filterRepository = await DI.orm.em.getRepository(Filter)
    DI.playlistRepository = await DI.orm.em.getRepository(Playlist)
    DI.userRepository = await DI.orm.em.getRepository(User)

    app.use('/api', apiController)
    app.use('/login', loginController)
    app.use('/logout', (req: Request, res: Response) =>
        req.session.destroy(() => res.clearCookie(CookieTypes.Session).clearCookie(CookieTypes.User).redirect(`/`))
    )
    app.use(express.static(`${__dirname}/../../PlaylistDJ.Frontend/public`))
    app.get('*', (req: Request, res: Response) =>
        res.sendFile(path.resolve(__dirname, '..', '..', 'PlaylistDJ.Frontend', 'public', 'index.html'))
    )
})()

export default app
