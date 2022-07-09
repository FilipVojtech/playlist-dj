import express, { Response } from 'express'
import { Profile, User } from '../entities'
import { endpoint, generateRandomString, requestToken } from '../utility'
import { DI } from '../app'
import { Request } from '../global'

const router = express.Router()
const spotifyAuthUrl = 'http://accounts.spotify.com/authorize'

/**
 * Redirect user to a spotify login page
 * If successful redirect is made to the /callback endpoint
 */
router.get('/', (req: Request, res: Response) => {
    req.session.spotifyState = generateRandomString(16)

    if (req.query.gdpr) req.session.gdpr = true

    const query = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.PDJ_CLIENT_ID as string,
        scope: 'user-follow-modify ugc-image-upload user-library-modify playlist-read-private playlist-modify-private playlist-modify-public user-read-email user-read-private',
        state: req.session.spotifyState,
        redirect_uri: `${process.env.REDIRECT_URI}/login/callback`,
    })

    res.redirect(`${spotifyAuthUrl}?${query}`)
})

/**
 * User is redirected here if they grant permission to use their data
 */
router.get('/callback', async (req: Request, res: Response) => {
    if (!req.query.error) {
        if (req.query.state === req.session.spotifyState) {
            const code = req.query.code as string
            const user = new User(code)

            user.token = await requestToken(code)
            user.profile = (await endpoint(user.token.value).me()) as Profile

            let userFromDb = await DI.userRepository.findOne({ profile: { spotifyId: user.profile.spotifyId } })

            if (req.session.gdpr) user.consent = new Date()

            if (!userFromDb) {
                await DI.userRepository.persistAndFlush(user)
                req.session.user = user
            } else {
                user.consent = userFromDb.consent
                DI.userRepository.assign(userFromDb, user)
                await DI.userRepository.flush()
                req.session.user = userFromDb
            }

            res.cookie('user', JSON.stringify(user.profile)).redirect('/#')
        } else {
            console.error(`State string (${req.query.state}) differs from the expected (${req.session.spotifyState})`)
            res.status(401).send('State strings do not match')
        }
    } else {
        console.error(req.query.error)
        res.status(500).send('Internal server error')
    }
})

export default router
