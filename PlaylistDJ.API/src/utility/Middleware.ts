import { Request } from '../global'
import { NextFunction, Response } from 'express'
import { renewToken as spotifyRenewToken } from './Spotify'

export function log(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.originalUrl}\n`, req)
    next()
    console.log(`RESPONSE`, res)
}

export function authentication(req: Request, res: Response, next: NextFunction) {
    if (!req.session.user)
        res.sendStatus(401)
    else next()
}

export async function renewToken(req: Request, res: Response, next: NextFunction) {
    req.session.user!.token = await spotifyRenewToken(req.session.user!)
    next()
}
