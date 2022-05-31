import { User } from '@playlist-dj/api/dist/entities'

export namespace Spotify {
    export interface UserMinimal {
        'externalUrls': {
            'spotify': string
        }
        'href': string
        'id': string
        'type': 'user'
        'uri': string
    }

    export interface Artist {
        externalUrls: { [key: string]: string }
        followers: { href: string | null, total: number }
        genres: string[]
        href: string
        id: string
        images: [{ height: number, url: string, width: number }]
        name: string
        popularity: number
        type: string
        uri: string
    }

    export interface Album {
        albumType: string
        artists: Artist[]
        externalUrls: { [key: string]: string }
        href: string
        id: string
        images: [{ height: number, url: string, width: number }]
        name: string
        releaseDate: string
        releaseDatePrecision: string
        totalTracks: number
        type: string
        uri: string
    }

    export interface Track {
        album: Album
        artists: Artist[]
        discNumber: number
        durationMs: number
        explicit: boolean
        externalIds: { [key: string]: string }
        externalUrls: { [key: string]: string }
        href: string
        id: string
        isLocal: boolean
        isPlayable: boolean
        name: string
        popularity: string
        previewUrl: string
        trackNumber: number
        type: string
        uri: string
    }

    export interface TrackFromPlaylist {
        addedAt: string
        addedBy: UserMinimal
        isLocal: boolean
        primaryColor: null | string
        track: Track
        videoThumbnail: {
            url: null | string
        }
    }

    export interface Playlist {

    }

    export interface SearchResults {
        albums?: {
            href: string
            items: Album[]
            limit: number
            next: string | null
            offset: number
            previous: string | null
            total: number
        }
        artists?: {
            href: string
            items: Artist[]
            limit: number
            next: string | null
            offset: number
            previous: string | null
            total: number

        }
        tracks?: {
            href: string
            items: Track[]
            limit: number
            next: string | null
            offset: number
            previous: string | null
            total: number
        }
    }

    export interface PlaylistInfo {
        collaborative: boolean
        description: string
        externalUrls: { [key: string]: string }
        followers: { href: null, total: number }
        href: string
        id: string
        images: [0] | { height: number, url: string, width: number }[]
        name: string
        owner: User
        primaryColor: null | string
        public: boolean
        snapshotId: string
        tracks: {
            href: string,
            items: [0],
            limit: number,
            next: null | string,
            offset: number
        }
        type: 'playlist'
        uri: string
    }
}

export declare type FilterType = 'album' | 'author' | 'song'
