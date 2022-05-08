import express, { Response } from 'express'
import { Request } from '../global'
import { Spotify } from '@playlist-dj/types'
import { DI } from '../app'
import { User } from '../entities'
import { endpoint, renewToken } from '../Classes'
import socialController from './SocialController'
import playlistController from './PlaylistController'
import userController from './UserController'

const router = express.Router()

/**
 * Debug route
 */
if (!process.env.PRODUCTION) {
    router.get('/debug', async (req: Request, res: Response) => {
        req.session.user = await DI.userRepository.findOne({ profile: { email: 'filip@aprex.cz' } }) as User
        res.sendStatus(200)
    })
}

/**
 * Return API status
 */
router.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        status: {
            api: 'running',
            database: 'running',
        },
    })
})

router.all('*', (req: Request, res: Response, next) => {
    if (!req.session.user) res.sendStatus(401)
    else next()
})

/**
 * Playlist paths
 */
router.use('/playlist', playlistController)

/**
 * User paths
 */
router.use('/user', userController)

/**
 * Social paths
 */
router.use('/social', socialController)

/**
 * Search endpoint
 * @query {string} q - search term
 * @query {('artist' | 'album' | 'track') | string} type - Which category user wants to search in
 * @returns {Spotify.SearchResults} Search results from Spotify
 */
router.get('/search', async (req: Request, res: Response) => {
    req.session.user!.token = await renewToken(req.session.user!)

    // Search through param is present
    if (req.query.url) {
        res.json(await endpoint(req.session.user!).url(req.query.url as string))
        return
    }

    // Set type to any if not present
    if (!req.query.type) req.query.type = 'artist,album,track'
    // Set limit if not present
    if (!req.query.limit) req.query.limit = '10'


    // @ts-ignore
    if (typeof req.query.type !== 'string' && !(req.query.type === 'artist' || req.query.type === 'album' || req.query.type === 'track')) res.sendStatus(400)
    else if (!req.query.q || typeof req.query.q !== 'string') res.sendStatus(400)
    else if (typeof req.query.limit !== 'string') req.query.limit.toString()
    else res.json(await endpoint(req.session.user!).search(req.query.type, req.query.q, req.query.limit))
})

export default router
