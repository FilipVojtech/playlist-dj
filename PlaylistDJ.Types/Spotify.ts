import type { FilterType } from './index'

export declare namespace Spotify {
    interface UserMinimal {
        externalUrls: {
            spotify: string
        }
        href: string
        id: string
        type: 'user'
        uri: string
    }
    interface Artist {
        externalUrls: {
            [key: string]: string
        }
        followers: {
            href: string | null
            total: number
        }
        genres: string[]
        href: string
        id: string
        images: Images
        name: string
        popularity: number
        type: FilterType
        uri: string
    }
    interface Album {
        albumType: string
        artists: Artist[]
        externalUrls: {
            [key: string]: string
        }
        href: string
        id: string
        images: Images
        name: string
        releaseDate: string
        releaseDatePrecision: string
        totalTracks: number
        type: FilterType
        uri: string
    }
    interface Track {
        album: Album
        artists: Artist[]
        discNumber: number
        durationMs: number
        explicit: boolean
        externalIds: {
            [key: string]: string
        }
        externalUrls: {
            [key: string]: string
        }
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
    interface TrackFromPlaylist {
        addedAt: string
        addedBy: UserMinimal
        isLocal: boolean
        primaryColor: null | string
        track: Track
        videoThumbnail: {
            url: null | string
        }
    }
    interface SearchResults {
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
    interface Playlist {
        collaborative: boolean
        description: string
        externalUrls: {
            [key: string]: string
        }
        followers: {
            href: null
            total: number
        }
        href: string
        id: string
        images: Images
        name: string
        owner: UserMinimal
        primaryColor: null | string
        public: boolean
        snapshotId: string
        tracks: {
            href: string
            items: [0]
            limit: number
            next: null | string
            offset: number
        }
        type: 'playlist'
        uri: string
    }
    interface Image {
        width: number
        height: number
        url: string
    }
    type Images = [0] | [Image] | [Image, Image, Image]
}
