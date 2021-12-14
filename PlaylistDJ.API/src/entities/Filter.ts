import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from './'

@Entity()
export class Filter extends BaseEntity {
    @Property()
    schemaVersion = '1'

    @Property()
    name: string

    constructor(name: string) {
        super()
        this.name = name
    }
}
