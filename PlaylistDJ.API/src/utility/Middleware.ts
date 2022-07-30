import { Request } from '../global'
import { NextFunction, Response } from 'express'
import { renewToken as spotifyRenewToken } from './Spotify'
import { DI } from '../app'

export function log(req: Request, res: Response, next: NextFunction) {
    if (!process.env.PRODUCTION) console.log(`${req.method} ${req.originalUrl}\n`, req)
    next()
    if (!process.env.PRODUCTION) console.log(`RESPONSE`, res)
}

export function authentication(req: Request, res: Response, next: NextFunction) {
    if (!req.session.user) res.sendStatus(401)
    else next()
}

export async function renewToken(req: Request, res: Response, next: NextFunction) {
    req.session.user!.token = await spotifyRenewToken(req.session.user!)
    next()
}

export async function userIsOwner(req: Request, res: Response, next: NextFunction) {
    if (req.playlist!.owner._id.toString() !== req.session.user!._id.toString()) res.sendStatus(403)
    else next()
}

export async function getPlaylist(req: Request, res: Response, next: NextFunction) {
    if (!req.params.id) {
        res.sendStatus(400)
        return
    }

    const playlist = await DI.playlistRepository.findOne({ id: req.params.id }, { populate: true })

    if (playlist) {
        req.playlist = playlist
        next()
    } else res.sendStatus(404)
}
