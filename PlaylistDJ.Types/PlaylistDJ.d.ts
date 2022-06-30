import * as Express from 'express';
import { FilterType } from './index';
export interface SearchFilter {
    id: string;
    type: FilterType;
}
export interface FilterRequest extends Express.Request {
    body: SearchFilter[];
}
export declare namespace PDJ {
    interface Artist {
        href: string;
        id: string;
        name: string;
        type: FilterType;
    }
    interface Album {
        id: string;
        images: [{
            height: number;
            url: string;
            width: number;
        }];
        name: string;
        type: FilterType;
        artists: Artist[];
    }
    interface Track {
        name: string;
        id: string;
        album: Album;
        artists: Artist[];
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
