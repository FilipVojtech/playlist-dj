import { Entity, ManyToOne, OneToOne, Property } from '@mikro-orm/core'
import { BaseEntity, Filter, User } from './'

@Entity()
export class Playlist extends BaseEntity {
    @Property()
    schemaVersion = '1'

    @Property()
    name: string

    @Property()
    description: string

    @Property()
    images: { src: string, height: string }[] = []

    @Property()
    notes: string

    @ManyToOne(() => Filter)
    filters = []

    @Property()
    isPublic: boolean = true

    @ManyToOne()
    owner!: User

    @Property()
    spotifyID: string = ''

    @Property()
    fromPlaylistID: string = ''

    @Property()
    hasViewAccess: User[]

    constructor(owner: User, name: string = '', description: string = '', notes: string = '') {
        super()
        this.owner = owner
        this.name = name
        this.description = description
        this.notes = notes
        this.hasViewAccess = []
    }
}
