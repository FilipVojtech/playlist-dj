import express, { Request, Response } from 'express'
import { stringify } from 'querystring'
import { User } from '../entities'
import { endpoint, generateRandomString, requestToken } from '../Utility'
import { DI } from '../app'

const router = express.Router()
const url = 'http://localhost:3000'
const spotifyAuthUrl = 'http://accounts.spotify.com/authorize'

/**
 * Redirect user to a spotify login page
 * If successful redirect is made to the /callback endpoint
 */
router.get('/', (req: Request, res: Response) => {
    // @ts-ignore
    req.session.spotifyState = generateRandomString(16)
    // @ts-ignore
    req.session.frontendState = req.query.state

    const query = stringify({
        response_type: 'code',
        client_id: process.env.PDJ_CLIENT_ID,
        scope: 'user-follow-modify ugc-image-upload user-library-modify playlist-modify-private playlist-modify-public user-read-email user-read-private',
        // @ts-ignore
        state: req.session.spotifyState,
        redirect_uri: `${url}/login/callback`,
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
        // @ts-ignore
        if (req.query.state === req.session.spotifyState) {
            const code = req.query.code as string
            const user = new User(code)

            user.token = await requestToken(code)
            await DI.userRepository.persistAndFlush(user)

            user.profile = await endpoint.me(user)
            await DI.userRepository.flush()

            // Return user details back to frontend
            const query = stringify({
                user: user.id,
                // @ts-ignore
                state: req.session.frontendState,
            })

            res.redirect(`${url}?${query}`)
        } else {
            // @ts-ignore
            console.error(`State string (${req.query.state}) differs from the expected (${req.session.spotifyState})`)
            res.status(401).send("State string doesn't match")
        }
    } else {
        console.error(req.query.error)
        res.status(500).send('Internal server error')
    }
})

export const loginController = router
