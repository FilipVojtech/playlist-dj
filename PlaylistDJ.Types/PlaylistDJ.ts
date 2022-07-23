import type * as Express from 'express'
import type { FilterType, Spotify } from './index'

export interface SearchFilter {
    id: string
    type: FilterType
}

export interface FilterRequest extends Express.Request {
    body: SearchFilter[]
}

export namespace PDJ {
    export interface Artist {
        id: string
        name: string
        images: Spotify.Images
        href: string
        type: FilterType
    }

    export interface Album {
        id: string
        name: string
        images: Spotify.Images
        artists: Artist[]
        type: FilterType
    }

    export interface Track {
        id: string
        name: string
        album: Album
        artists: Artist[]
        type: FilterType
    }

    export interface Playlist {
        name: string
        description: string
        images: Spotify.Images
        notes: string
        filters: SearchFilter[]
        isPublic: boolean
        owner: User
        isPinned: boolean
        spotifyId: string
        canView: User[]
        canEdit: User[]
    }

    export interface FilterList {
        artists?: { items: Artist[] }
        albums?: { items: Album[] }
        tracks?: { items: Track[] }
        length: number
    }

    export interface Profile {
        country: string
        displayName: string
        email: string
        explicitContent: { enabled: boolean; locked: boolean }
        externalUrls: {}
        href: string
        spotifyId: string
        images: Spotify.Images
        product: Spotify.Product
        uri: string
    }

    export interface User {
        schemaVersion: string
        code: string
        consent: Date
        token: Spotify.Token
        profile: Profile
        communication: {
            sendMarketing: boolean
        }
    }

    export interface Post {
        author: User
        message: string
        playlist: Playlist
        stars: string[] | number
    }
}
