import * as Express from 'express'
import * as ExpressSession from 'express-session'
import { User } from './entities'

export interface Request extends Express.Request {
    session: Session
}

interface Session extends ExpressSession.Session {
    spotifyState?: string
    user?: User
}
