import * as Express from 'express'
import * as ExpressSession from 'express-session'
import { Playlist, Post, User } from './entities'

export interface Request extends Express.Request {
    session: Session
    playlist?: Playlist
    post?: Post
}

interface Session extends ExpressSession.Session {
    [key: string]: any
    spotifyState?: string
    user?: User
}
