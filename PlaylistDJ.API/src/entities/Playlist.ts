import { Entity, ManyToOne, Property } from '@mikro-orm/core'
import { BaseEntity, Filter, User } from './'

@Entity()
export class Playlist extends BaseEntity {
    @Property()
    schemaVersion = '1'

    @Property()
    name: string

    @Property()
    description: string = ''

    @Property()
    images: { src: string, height: string }[] = []

    @Property()
    notes: string = ''

    @ManyToOne(() => Filter)
    filters = []

    @Property()
    isPublic: boolean = true

    @ManyToOne(() => User)
    owner!: User

    @Property()
    isPinned: boolean = false

    @Property()
    spotifyID: string = ''

    @Property()
    fromPlaylistID: string = ''

    @Property()
    hasViewAccess: User[]

    constructor(owner: User, name: string) {
        super()
        this.owner = owner
        this.name = name
        this.hasViewAccess = []
    }
}
