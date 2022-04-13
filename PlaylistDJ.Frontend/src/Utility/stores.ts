import { readable, writable } from 'svelte/store'
import { getCookies } from './index'

export const showNav = writable(true)

export const user = readable(getCookies().user)

export const searchResult = writable({} as { id: string, type: '' | 'artist' | 'album' | 'track' })
