import type { PDJ } from '@playlist-dj/types'
import { FilterType } from '@playlist-dj/types'

export default class Track implements PDJ.Track {
    id: string
    name: string
    album: PDJ.Album
    artists: PDJ.Artist[]
    type: FilterType = FilterType.Track
    uri: string

    constructor(id: string, name: string, album: PDJ.Album, artists: PDJ.Artist[], uri: string) {
        this.id = id
        this.name = name
        this.album = album
        this.artists = artists
        this.uri = uri
    }
}
