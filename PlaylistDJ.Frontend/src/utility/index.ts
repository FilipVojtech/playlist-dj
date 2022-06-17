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
    for (const { name } of artists) list += `${name}, `
    return list.substring(0, list.length - 2)
}

export function copyToClipboard(textToCopy: string) {
    // navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard api method'
        return navigator.clipboard.writeText(textToCopy)
    } else {
        // text area method
        let textArea = document.createElement('textarea')
        textArea.value = textToCopy
        // make the textarea out of viewport
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        return new Promise((res, rej) => {
            // here the magic happens
            document.execCommand('copy') ? res(undefined) : rej()
            textArea.remove()
        })
    }
}

interface Cookies {
    [index: string]: CookieValue
}

type CookieValue = string | number | JSON

export { default as ModalAction } from './ModalAction'
