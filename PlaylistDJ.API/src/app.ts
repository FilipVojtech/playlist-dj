import { NextFunction, Request, Response } from 'express'
import config from './mikro-orm.config'
import { EntityManager, EntityRepository, MikroORM, RequestContext } from '@mikro-orm/core'
import { apiController } from './controllers'

const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

const app = express()

export const DI = {} as {
    orm: MikroORM
    em: EntityManager
}

// Bootstrap the app
;(async () => {
    app.use(morgan('dev'))
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(cookieParser())

    DI.orm = await MikroORM.init(config)
    DI.em = DI.orm.em

    app.use((req: Request, res: Response, next: NextFunction) => {
        RequestContext.create(DI.orm.em, next)
        // @ts-ignore
        req.DI = DI
    })

    app.use('/api', apiController)
})()

module.exports = app
