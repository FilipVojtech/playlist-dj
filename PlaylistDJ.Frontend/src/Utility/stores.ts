import { readable, writable } from 'svelte/store'
import { getCookies } from './index'

export const showNav = writable(true)

export const user = readable(getCookies().user)
