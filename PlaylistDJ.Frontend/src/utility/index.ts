import type { Spotify } from '@playlist-dj/types'

/**
 * Get cookies stored on the page
 * @returns
 */
export function getCookies() {
    const splitCookieString = document.cookie.split(';')
    let cookies: Cookies = {}

    for (let i = 0; i < splitCookieString.length; ++i) {
        const cookieKey = splitCookieString[i].split('=')[0].trim()
        let cookieValue: CookieValue = decodeURIComponent(splitCookieString[i].split('=')[1])

        try {
            cookieValue = JSON.parse(cookieValue)
        } catch (e) {}

        cookies[cookieKey] = cookieValue
    }
    return cookies
}

export function artistListFromArray(artists: Spotify.Artist[]): string {
    let list = ''
    for (const { name } of artists)
        list += `${name}, `
    return list.substring(0, list.length - 2)
}

interface Cookies {
    [index: string]: CookieValue
}

type CookieValue = string | number | JSON

export { default as ModalAction } from './ModalAction'
