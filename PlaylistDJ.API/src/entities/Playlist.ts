import { Entity, ManyToOne, Property } from '@mikro-orm/core'
import { BaseEntity, User } from './'
import type { PDJ, SearchFilter, Spotify } from '@playlist-dj/types'

@Entity()
export class Playlist extends BaseEntity implements PDJ.Playlist {
    @Property()
    schemaVersion = '1'

    @Property()
    name: string

    @Property()
    description: string = ''

    @Property()
    images: Spotify.Images = []

    @Property()
    notes: string = ''

    @Property()
    filters: SearchFilter[] = []

    @Property()
    isPublic: boolean = false

    @ManyToOne(() => User)
    owner!: User

    @Property()
    isPinned: boolean = false

    @Property()
    spotifyId: string = ''

    @Property()
    canView: User[] = []

    @Property()
    canEdit: User[] = []

    @Property()
    isMerged: boolean = false

    constructor(owner: User, name: string) {
        super()
        this.owner = owner
        this.name = name
    }
}
