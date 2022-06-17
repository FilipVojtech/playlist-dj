import * as Express from 'express'
import * as ExpressSession from 'express-session'
import { Playlist, User } from './entities'

export interface Request extends Express.Request {
    session: Session
    playlist?: Playlist
}

interface Session extends ExpressSession.Session {
    spotifyState?: string
    user?: User
}
