const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
import config from './mikro-orm.config'
import { EntityManager, MikroORM } from '@mikro-orm/core'
import ApiController from './controllers/ApiController'

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
})()

app.use('/api', ApiController)

module.exports = app
