import type { PDJ, Spotify } from '@playlist-dj/types'
import { BaseEntity, Profile } from './'
import { Embedded, Entity, Property } from '@mikro-orm/core'

@Entity()
export class User extends BaseEntity implements PDJ.User {
    @Property()
    schemaVersion: string = '1'

    @Property()
    code!: string

    @Property()
    consent: Date = new Date(0)

    @Property()
    token: Spotify.Token = {
        value: '',
        expiration: new Date(0),
        refreshToken: '',
    }

    @Embedded(() => Profile)
    profile!: Profile

    @Property()
    communication: {
        [key: string]: any
        // /** How frequently should be update emails sent */
        // updateFrequency: UpdateFrequency
        // /** If updateFrequency set to custom, then use this value
        //  * Currently disabled
        //  */
        // customFrequency: number
        /**
         * Should we send marketing emails to the user
         */
        sendMarketing: boolean
    } = {
        // updateFrequency: UpdateFrequency.Disabled,
        // customFrequency: 14,
        sendMarketing: false,
    }

    constructor(code: string) {
        super()
        this.code = code
    }
}
