import type { PDJ, Spotify } from '@playlist-dj/types'
import { FilterType } from '@playlist-dj/types'

export default class Album implements PDJ.Album {
    artists: PDJ.Artist[]
    id: string
    images: Spotify.Images
    name: string
    type: FilterType = FilterType.Album

    constructor(id: string, name: string, artists: PDJ.Artist[], images: Spotify.Images) {
        this.artists = artists
        this.id = id
        this.images = images
        this.name = name
    }
}
