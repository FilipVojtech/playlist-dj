import * as Express from 'express'
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

    export interface FilterList {
        artists?: { items: Artist[] }
        albums?: { items: Album[] }
        tracks?: { items: Track[] }
    }
}
