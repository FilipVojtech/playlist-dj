import { Entity, ManyToOne, Property } from '@mikro-orm/core'
import { BaseEntity, Filter } from './'

@Entity()
export class Playlist extends BaseEntity {
    @Property()
    schemaVersion = '1'
    @Property()
    name: string
    @Property()
    description: string
    @Property()
    notes: string
    @ManyToOne(() => Filter)
    filters = []

    constructor(name: string = '', description: string = '', notes: string = '') {
        super()
        this.name = name
        this.description = description
        this.notes = notes
    }
}
