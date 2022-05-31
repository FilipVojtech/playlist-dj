import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from './'
import { FilterType } from '@playlist-dj/types'

@Entity()
export class Filter extends BaseEntity {
    @Property()
    schemaVersion = '1'

    @Property()
    name: string

    @Property()
    type: FilterType

    @Property()
    spotifyId: string

    /**
     * @param name
     * @param type
     * @param id - Spotify ID of the item
     */
    constructor(name: string, type: FilterType, id: string) {
        super()
        this.name = name
        this.type = type
        this.spotifyId = id
    }
}
