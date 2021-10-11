import { NextFunction, Request, Response } from 'express'
import config from './mikro-orm.config'
import { EntityManager, EntityRepository, MikroORM, RequestContext } from '@mikro-orm/core'
import { apiController } from './controllers'
import { Filter, Playlist } from './entities'

const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

const app = express()

export const DI = {} as {
    orm: MikroORM
    em: EntityManager
    filterRepository: EntityRepository<Filter>
    playlistRepository: EntityRepository<Playlist>
}

// Bootstrap the app
;(async () => {
    app.use(morgan('dev'))
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(cookieParser())

    DI.orm = await MikroORM.init(config)
    DI.em = DI.orm.em
    DI.filterRepository = await DI.orm.em.getRepository(Filter)
    DI.playlistRepository = await DI.orm.em.getRepository(Playlist)

    app.use((req: Request, res: Response, next: NextFunction) => {
        RequestContext.create(DI.orm.em, next)
        // @ts-ignore
        req.DI = DI
    })

    app.use('/api', apiController)
})()

module.exports = app
