import express, { Request, Response } from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import session from 'express-session'
import { EntityManager, EntityRepository, MikroORM } from '@mikro-orm/core'
import { apiController, CookieTypes, loginController } from './controllers'
import { Filter, Playlist, User } from './entities'
import config from './mikro-orm.config'
import dotenv from 'dotenv'

dotenv.config()
const app = express()

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
    app.use(express.urlencoded({ extended: false }))
    app.use(cookieParser())
    app.use(bodyParser.json())
    app.use(
        session({
            saveUninitialized: false,
            secret: process.env.PDJ_SESSION_SECRET as string,
            rolling: true,
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

    app.use(express.static(`${__dirname}/public`))

    app.use('/api', apiController)
    app.use('/login', loginController)
    app.use('/logout', (req, res) =>
        res.clearCookie(CookieTypes.User).clearCookie(CookieTypes.Session).redirect(`http://localhost:3000/`)
    )
    app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
    })
})()

export default app
