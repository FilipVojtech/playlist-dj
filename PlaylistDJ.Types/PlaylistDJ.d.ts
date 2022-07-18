import type * as Express from 'express';
import type { FilterType, Spotify } from './index';
export interface SearchFilter {
    id: string;
    type: FilterType;
}
export interface FilterRequest extends Express.Request {
    body: SearchFilter[];
}
export declare namespace PDJ {
    interface Artist {
        id: string;
        name: string;
        images: Spotify.Images;
        href: string;
        type: FilterType;
    }
    interface Album {
        id: string;
        name: string;
        images: Spotify.Images;
        artists: Artist[];
        type: FilterType;
    }
    interface Track {
        id: string;
        name: string;
        album: Album;
        artists: Artist[];
        type: FilterType;
    }
    interface FilterList {
        artists?: {
            items: Artist[];
        };
        albums?: {
            items: Album[];
        };
        tracks?: {
            items: Track[];
        };
    }
}
