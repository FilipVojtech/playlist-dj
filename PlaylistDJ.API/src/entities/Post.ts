import type { PDJ } from '@playlist-dj/types'
import { BaseEntity } from './BaseEntity'
import { Entity, Property } from '@mikro-orm/core'

@Entity()
export class Post extends BaseEntity implements PDJ.Post {
    @Property()
    author: PDJ.User

    @Property()
    description: string = ''

    @Property()
    stars: PDJ.User[] = []

    @Property()
    playlist: PDJ.Playlist

    constructor(author: PDJ.User, playlist: PDJ.Playlist, description: string = '') {
        super()
        this.author = author
        this.playlist = playlist
        this.description = description
    }
}
