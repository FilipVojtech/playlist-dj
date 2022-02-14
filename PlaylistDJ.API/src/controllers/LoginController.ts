import express, { Response } from 'express'
import { stringify } from 'querystring'
import { User } from '../entities'
import { endpoint, generateRandomString, requestToken } from '../Utility'
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

    const query = stringify({
        response_type: 'code',
        client_id: process.env.PDJ_CLIENT_ID,
        scope: 'user-follow-modify ugc-image-upload user-library-modify playlist-modify-private playlist-modify-public user-read-email user-read-private',
        state: req.session.spotifyState,
        redirect_uri: 'http://localhost:3000/login/callback',
    })

    res.redirect(`${spotifyAuthUrl}?${query}`)
})

/**
 * User is redirected here if they grant permission to use their data
 *
 * Save the code from query
 * Request token
 * Request their user profile data from Spotify
 * Save token and data to DB
 * Redirect them back to the home page
 */
router.get('/callback', async (req: Request, res: Response) => {
    if (!req.query.error) {
        if (req.query.state === req.session.spotifyState) {
            const code = req.query.code as string
            const user = new User(code)

            user.token = await requestToken(code)
            user.profile = await endpoint.me(user)

            // @ts-ignore
            let userFromDb = await DI.userRepository.findOne({ 'profile.id': user.profile.id })

            if (!userFromDb) await DI.userRepository.persistAndFlush(user)
            else {
                DI.userRepository.assign(userFromDb, user)
                await DI.userRepository.flush()
            }

            // @ts-ignore
            req.session.user = userFromDb
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

export const loginController = router
