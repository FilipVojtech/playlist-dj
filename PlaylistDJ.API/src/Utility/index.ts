const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export function generateRandomString(length: number) {
    let string = ''
    for (let i = 0; i < length; i++) {
        string += characters[Math.floor(Math.random() * characters.length)]
    }
    return string
}

export enum CookieTypes {
    User = 'user',
    Session = 'connect.sid',
}

export * from './Spotify'
