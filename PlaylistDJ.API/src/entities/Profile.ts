import { Embeddable, Property } from '@mikro-orm/core'
import type { PDJ } from '@playlist-dj/types'
import { Spotify } from '@playlist-dj/types'

@Embeddable()
export class Profile implements PDJ.Profile {
    @Property()
    schemaVersion = '1'

    @Property()
    country: string

    @Property()
    displayName: string

    @Property()
    email: string

    @Property()
    explicitContent: { enabled: boolean; locked: boolean }

    @Property()
    externalUrls: {}

    @Property()
    href: string

    @Property()
    spotifyId: string

    @Property()
    images: Spotify.Images

    @Property()
    product: Spotify.Product

    @Property()
    uri: string

    constructor(
        country: string,
        displayName: string,
        email: string,
        explicitContent: { enabled: boolean; locked: boolean },
        externalUrls: {},
        href: string,
        spotifyId: string,
        images: Spotify.Images,
        product: Spotify.Product,
        uri: string
    ) {
        this.country = country
        this.displayName = displayName
        this.email = email
        this.explicitContent = explicitContent
        this.externalUrls = externalUrls
        this.href = href
        this.spotifyId = spotifyId
        this.images = images
        this.product = product
        this.uri = uri
    }

    /**
     * Create a profile from spotify response body
     * @param body
     */
    static fromBody = (body: {
        uri: string
        product: Spotify.Product
        images: Spotify.Images
        id: string
        href: string
        externalUrls: {}
        explicit_content: {
            filter_enabled: boolean
            filter_locked: boolean
        }
        email: string
        display_name: string
        country: string
    }): Profile =>
        new Profile(
            body.country,
            body.display_name,
            body.email,
            {
                enabled: body.explicit_content.filter_enabled,
                locked: body.explicit_content.filter_locked,
            },
            body.externalUrls,
            body.href,
            body.id,
            body.images,
            body.product,
            body.uri
        )
}
