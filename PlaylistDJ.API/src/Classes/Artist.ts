import type { PDJ, Spotify } from '@playlist-dj/types'
import { FilterType } from '@playlist-dj/types'

export default class Artist implements PDJ.Artist {
    id: string
    name: string
    images: Spotify.Images
    href: string
    type: FilterType = FilterType.Artist

    constructor(id: string, name: string, images: Spotify.Images, href: string) {
        this.id = id
        this.name = name
        this.images = images
        this.href = href
    }
}
