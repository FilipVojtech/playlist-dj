import type { PDJ } from '@playlist-dj/types'
import { BaseEntity } from './BaseEntity'
import { Entity, ManyToOne, Property } from '@mikro-orm/core'
import { Playlist } from './Playlist'
import { User } from './User'

@Entity()
export class Post extends BaseEntity implements PDJ.Post {
    @ManyToOne(() => User)
    author: User

    @Property()
    message: string

    @Property()
    stars: string[] = []

    @ManyToOne(() => Playlist)
    playlist: PDJ.Playlist

    constructor(author: User, playlist: Playlist, description: string = '') {
        super()
        this.author = author
        this.playlist = playlist
        this.message = description
    }
}
