import * as Express from 'express'
import type { FilterType, Spotify } from './index'

export interface SearchFilter {
    id: string
    type: FilterType
}

export interface FilterRequest extends Express.Request {
    body: SearchFilter[]
}

export declare namespace PDJ {
    interface Artist {
        id: string
        name: string
        images: Spotify.Images
        href: string
        type: FilterType
    }

    interface Album {
        id: string
        name: string
        images: Spotify.Images
        artists: Artist[]
        type: FilterType
    }

    interface Track {
        id: string
        name: string
        album: Album
        artists: Artist[]
        type: FilterType
    }

    interface FilterList {
        artists?: { items: Artist[] }
        albums?: { items: Album[] }
        tracks?: { items: Track[] }
    }

    interface Profile {
        spotifyId: string
        email: string
        displayName: string
        images: Spotify.Images
        product: Spotify.Product
        explicitContent: { enabled: boolean; locked: boolean }
    }

    interface Token {
        value: string
        refreshToken: string
        expiration: Date
    }

    interface User {
        schemaVersion: string
        code: string
        token: Token
        profile: Profile
        communication: { [key: string]: any; sendMarketing: boolean }
    }
}
