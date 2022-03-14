import got from 'got'
import { DI } from '../app'
import { Profile, Token, User } from '../entities'
import { Spotify } from '@playlist-dj/types'
import { snakeToCamelCase } from './index'

const apiUrl = 'https://api.spotify.com/v1'
const accUrl = 'https://accounts.spotify.com'

/**
 * Exchange the authorization code for an Access Token.
 * @param code Authorization code
 */
export async function requestToken(code: string): Promise<Token> {
    const token: Token = {
        value: '',
        refreshToken: '',
        expiration: new Date(0),
    }

    await got(`${accUrl}/api/token`, {
        method: 'post',
        headers: {
            Authorization:
                'Basic ' +
                Buffer.from(`${process.env.PDJ_CLIENT_ID}:${process.env.PDJ_CLIENT_SECRET}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: {
            code: code,
            redirect_uri: 'http://localhost:3000/login/callback',
            grant_type: 'authorization_code',
        },
    })
        .then(res => JSON.parse(res.body))
        .then(({ access_token, expires_in, refresh_token }) => {
            const now = new Date()
            token.value = access_token
            token.expiration = new Date(now.setMilliseconds(now.getMilliseconds() + expires_in))
            token.refreshToken = refresh_token
        })
        .catch(e => console.error(e))

    return token
}

/**
 * Request refreshed token
 */
export async function renewToken(user: User): Promise<Token> {
    if (user.token.expiration.valueOf() > new Date().valueOf()) return user.token
    user = (await DI.userRepository.findOne({ profile: { spotifyId: user.profile.spotifyId } })) as User

    await got(`${accUrl}/api/token`, {
        method: 'post',
        headers: {
            Authorization:
                'Basic ' +
                Buffer.from(`${process.env.PDJ_CLIENT_ID}:${process.env.PDJ_CLIENT_SECRET}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: {
            refresh_token: user.token.refreshToken,
            grant_type: 'refresh_token',
        },
    })
        .then(res => JSON.parse(res.body))
        .then(({ access_token, expires_in }) => {
            const now = new Date()
            user.token.value = access_token
            user.token.expiration = new Date(now.setMilliseconds(now.getMilliseconds() + expires_in))
        })
        .catch(e => console.error(e))
    await DI.userRepository.flush()
    return user.token
}

/**
 * Spotify API endpoints
 */
export function endpoint(user: User) {
    const headers = {
        Authorization: `Bearer ${user.token.value}`,
        'Content-Type': 'application/json',
    }

    return {
        /**
         * Send request when already having an url
         * @param url
         */
        async url(url: string) {
            return await got(url, { headers })
                .then(value => JSON.parse(value.body))
                .catch(e => console.error(e))
        },

        /**
         * @returns Detailed profile information about the current user (including the current user username).
         */
        async me(): Promise<Profile | null> {
            return await got(`${apiUrl}/me`, { headers })
                    .then(value => JSON.parse(value.body))
                    .then(body => Profile.fromBody(body))
                    .catch(e => console.error(e))
                ?? null
        },

        /**
         * Search on Spotify
         * @param type Which categories to search in
         * @param query Search phrase
         * @param limit Limit results count
         * @returns Search results
         */
        async search(type: 'artist' | 'album' | 'track' | string, query: string, limit = '10'): Promise<Spotify.SearchResults> {
            const queryParams = new URLSearchParams({
                q: query,
                type,
                limit,
                market: user.profile.country,
            })

            return await got(`${apiUrl}/search?${queryParams.toString()}`, { headers })
                .then(value => JSON.parse(value.body) as Spotify.SearchResults)
                .then(value => snakeToCamelCase(value) as any)
                .catch(e => console.error(e))
        },

        async getOwnedPlaylists() {
            return await got(`${apiUrl}/me/playlists`, { headers })
                .then(data => JSON.parse(data.body))
                .catch(e => console.error(e))
        },
    }
}
