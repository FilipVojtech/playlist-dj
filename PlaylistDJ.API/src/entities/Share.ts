import { BaseEntity } from './BaseEntity'
import { Entity, ManyToOne, Property } from '@mikro-orm/core'
import { User } from './User'
import { Playlist } from './Playlist'

@Entity()
export class Share extends BaseEntity {
    @ManyToOne(() => User)
    user: User

    @ManyToOne(() => Playlist)
    playlist: Playlist

    @Property()
    code: string

    constructor(user: User, playlist: Playlist, code: string) {
        super()
        this.user = user
        this.playlist = playlist
        this.code = code
    }
}
