import type { Writable } from 'svelte/store'
import { readable, writable } from 'svelte/store'
import { getCookies } from './index'
import type { SearchFilter } from '@playlist-dj/types'

export const showNav = writable(true)

export const user = readable(getCookies().user)

export const searchResult: Writable<SearchFilter> | {} = writable({})
