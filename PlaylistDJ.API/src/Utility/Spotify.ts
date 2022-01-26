import got from 'got'
import { DI } from '../app'
import { Token, User } from '../entities'

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
async function renewToken(user: User) {
    if (user.token.expiration.valueOf() > new Date().valueOf()) return
    user = (await DI.userRepository.findOne({ id: user.id })) as User

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
}

/**
 * Spotify API endpoints
 */
export const endpoint = {
    /**
     * Get detailed profile information about the current user (including the current user's username).
     */
    async me(user: User): Promise<Profile> {
        let returnValue = new Profile()
        await renewToken(user)
        await got(`${apiUrl}/me`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${user.token.value}`,
                'Content-Type': 'application/json',
            },
        })
            .then(value => JSON.parse(value.body))
            .then(body => {
                returnValue = profileFromBody(body)
            })
            .catch(e => console.error(e))

        return returnValue
    },

    async getOwnedPlaylists(user: User) {
        await renewToken(user)
        return await got(`${apiUrl}/me/playlists`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${user.token.value}`,
                'Content-Type': 'application/json',
            },
        })
            .then(data => JSON.parse(data.body))
            .catch(e => console.error(e))
    },
}

function profileFromBody(body: {
    uri: string
    product: 'free' | 'premium'
    images: [{ height: string; url: string; width: string }]
    id: string
    href: string
    externalUrls: {}
    explicit_content: {
        filter_enabled: boolean
        filter_locked: boolean
    }
    email: string
    display_name: string
    country: string
}): Profile {
    return new Profile(
        body.country,
        body.display_name,
        body.email,
        {
            enabled: body.explicit_content.filter_enabled,
            locked: body.explicit_content.filter_locked,
        },
        body.externalUrls,
        body.href,
        body.id,
        body.images,
        body.product,
        body.uri
    )
}

export class Profile {
    constructor(
        country: string = '',
        displayName: string = '',
        email: string = '',
        explicitContent: { enabled: boolean; locked: boolean } = { enabled: true, locked: true },
        externalUrls: {} = {},
        href: string = '',
        id: string = '',
        images: [{ height: string; url: string; width: string }] = [{ height: '', url: '', width: '' }],
        product: 'premium' | 'free' = 'free',
        uri: string = ''
    ) {
        this.country = country
        this.displayName = displayName
        this.email = email
        this.explicitContent = explicitContent
        this.externalUrls = externalUrls
        this.href = href
        this.id = id
        this.images = images
        this.product = product
        this.uri = uri
    }

    country: string
    displayName!: string
    email!: string
    explicitContent: { enabled: boolean; locked: boolean }
    externalUrls: {}
    href: string
    id: string
    images: [{ height: string; url: string; width: string }]
    product: 'premium' | 'free'
    uri: string
}
