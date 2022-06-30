import type { PDJ, Spotify } from '@playlist-dj/types'
import { Artist } from '../Classes'

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export function generateRandomString(length: number) {
    let string = ''
    for (let i = 0; i < length; i++) {
        string += characters[Math.floor(Math.random() * characters.length)]
    }
    return string
}

function toCamel(s: string) {
    return s.replace(/(_[a-z])/gi, char => char.toUpperCase().replace('_', ''))
}

export function snakeToCamelCase(object: { [key: string]: any } | string | []): object | string | [] | null {
    if (object === null) return null
    if (Array.isArray(object)) return object.map(i => snakeToCamelCase(i))
    else if (typeof object === 'object') {
        let n: { [key: string]: any } = {}
        Object.keys(object).forEach(key => {
            n[toCamel(key)] = snakeToCamelCase(object[key])
        })
        return n
    } else return object
}

export function artistsFromSpotifyArtists(artists: Spotify.Artist[]): PDJ.Artist[] {
    let value: PDJ.Artist[] = []
    artists.forEach(({ id: artistId, name, href, images }) => value.push(new Artist(artistId, name, images, href)))
    return value
}

export enum CookieTypes {
    User = 'user',
    Session = 'connect.sid',
}

export * from './Spotify'
