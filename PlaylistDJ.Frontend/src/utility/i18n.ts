import { getLocaleFromNavigator, init, register } from 'svelte-i18n'
import { getCookies } from './index'

register('en', () => import('./../locale/en.json'))
register('cs', () => import('./../locale/cs.json'))
register('de', () => import('./../locale/de.json'))

let forceLang: string | undefined // = 'cs'

const initialLocale = () => {
    const cookies = getCookies()
    if (forceLang) {
        console.error('Forcing language: ', forceLang)
        return forceLang
    } else if (cookies.locale) return cookies.locale as string
    else return getLocaleFromNavigator()
}

init({
    fallbackLocale: 'en',
    initialLocale: initialLocale(),
})
