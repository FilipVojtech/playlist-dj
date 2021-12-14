import { BaseEntity } from './'
import { Entity, Property } from '@mikro-orm/core'
import { Profile } from '../Utility'

@Entity()
export class User extends BaseEntity {
    @Property()
    schemaVersion: string = '1'

    @Property()
    code!: string

    @Property()
    token: Token = {
        value: '',
        expiration: new Date(0),
        refreshToken: '',
    }

    @Property()
    profile: Profile = new Profile()

    constructor(code: string) {
        super()
        this.code = code
    }
}

export interface Token {
    value: string
    refreshToken: string
    expiration: Date
}
