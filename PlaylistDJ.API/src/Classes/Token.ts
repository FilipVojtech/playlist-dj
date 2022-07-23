import { Spotify } from '@playlist-dj/types'

export default class Token implements Spotify.Token {
    expiration: Date = new Date()
    refreshToken: string = ''
    value: string = ''
}
