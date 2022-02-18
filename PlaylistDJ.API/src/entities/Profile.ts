import { Embeddable, Property } from '@mikro-orm/core'

@Embeddable()
export class Profile {
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
    images: [{ height: string; url: string; width: string }]

    @Property()
    product: 'premium' | 'free'

    @Property()
    uri: string

    /**
     * Create a profile from spotify response body
     * @param body
     */
    static fromBody = (body: {
        uri: string
        product: 'free' | 'premium'
        images: [{ height: string; url: string; width: string }]
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
    }): Profile => new Profile(
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
        body.uri,
    )

    constructor(
        country: string,
        displayName: string,
        email: string,
        explicitContent: { enabled: boolean; locked: boolean },
        externalUrls: {},
        href: string,
        spotifyId: string,
        images: [{ height: string; url: string; width: string }],
        product: 'premium' | 'free',
        uri: string) {
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
}
