import express, { Response } from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import session from 'express-session'
import { MikroORM, RequestContext } from '@mikro-orm/core'
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb'
import dotenv from 'dotenv'
import { apiController, loginController } from './controllers'
import { Playlist, Post, Profile, User } from './entities'
import config from './mikro-orm.config'
import { CookieTypes } from './utility'
import { Request } from './global'
// @ts-ignore
import connect_mongodb_session from 'connect-mongodb-session'
import { existsSync } from 'node:fs'

// Import environment variables
dotenv.config()

// Set up MongoDB session store
const MongoDBStore = connect_mongodb_session(session)
const store = new MongoDBStore({
    uri: process.env.DB_STRING,
    databaseName: 'playlistdj',
    collection: 'session',
})

// Initialize Express
const app = express()

// Define MikroORM types
export const DI = {} as {
    orm: MikroORM
    em: EntityManager
    playlistRepository: EntityRepository<Playlist>
    postRepository: EntityRepository<Post>
    profileRepository: EntityRepository<Profile>
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
                sameSite: 'lax',
            },
        })
    )
    app.use((req: Request, res: Response, next) => RequestContext.create(DI.orm.em, next))

    DI.orm = await MikroORM.init(config)
    DI.em = DI.orm.em as EntityManager
    DI.playlistRepository = DI.orm.em.getRepository(Playlist) as EntityRepository<Playlist>
    DI.postRepository = DI.orm.em.getRepository(Post) as EntityRepository<Post>
    DI.profileRepository = DI.orm.em.getRepository(Profile) as EntityRepository<Profile>
    DI.userRepository = DI.orm.em.getRepository(User) as EntityRepository<User>

    app.use('/api', apiController)
    app.use('/login', loginController)
    app.use('/logout', (req: Request, res: Response) =>
        req.session.destroy(() => res.clearCookie(CookieTypes.Session).clearCookie(CookieTypes.User).redirect(`/`))
    )
    app.use('/tos/:lang?', (req, res) => {
        const defaultFile = path.resolve(__dirname, 'public', 'tos.pdf')
        let lang = ''

        if (req.params.lang) lang = `-${req.params.lang}`

        const translatedFile = path.resolve(__dirname, 'public', `tos${lang}.pdf`)

        if (existsSync(translatedFile)) res.sendFile(translatedFile)
        else res.sendFile(defaultFile)
    })
    app.use('/privacy/:lang?', (req, res) => {
        const defaultFile = path.resolve(__dirname, 'public', 'privacypolicy.pdf')
        let lang = ''

        if (req.params.lang) lang = `-${req.params.lang}`

        const translatedFile = path.resolve(__dirname, 'public', `privacypolicy${lang}.pdf`)

        if (existsSync(translatedFile)) res.sendFile(translatedFile)
        else res.sendFile(defaultFile)
    })
    app.use(express.static(`${__dirname}/../../PlaylistDJ.Frontend/public`))
    app.get('*', (req: Request, res: Response) =>
        res.sendFile(path.resolve(__dirname, '..', '..', 'PlaylistDJ.Frontend', 'public', 'index.html'))
    )
})()

export default app
