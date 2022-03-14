export declare namespace Spotify {
    interface Artist {
        externalUrls: {
            [key: string]: string;
        };
        followers: {
            href: string | null;
            total: number;
        };
        genres: string[];
        href: string;
        id: string;
        images: [{
            height: number;
            url: string;
            width: number;
        }];
        name: string;
        popularity: number;
        type: string;
        uri: string;
    }
    interface Album {
        albumType: string;
        artists: Artist[];
        externalUrls: {
            [key: string]: string;
        };
        href: string;
        id: string;
        images: [{
            height: number;
            url: string;
            width: number;
        }];
        name: string;
        releaseDate: string;
        releaseDatePrecision: string;
        totalTracks: number;
        type: string;
        uri: string;
    }
    interface Track {
        album: Album;
        artists: Artist[];
        discNumber: number;
        durationMs: number;
        explicit: boolean;
        externalIds: {
            [key: string]: string;
        };
        externalUrls: {
            [key: string]: string;
        };
        href: string;
        id: string;
        isLocal: boolean;
        isPlayable: boolean;
        name: string;
        popularity: string;
        previewUrl: string;
        trackNumber: number;
        type: string;
        uri: string;
    }
    interface SearchResults {
        albums?: {
            href: string;
            items: Album[];
            limit: number;
            next: string | null;
            offset: number;
            previous: string | null;
            total: number;
        };
        artists?: {
            href: string;
            items: Artist[];
            limit: number;
            next: string | null;
            offset: number;
            previous: string | null;
            total: number;
        };
        tracks?: {
            href: string;
            items: Track[];
            limit: number;
            next: string | null;
            offset: number;
            previous: string | null;
            total: number;
        };
    }
}
