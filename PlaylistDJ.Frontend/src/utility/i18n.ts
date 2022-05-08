import { getLocaleFromNavigator, init, register } from 'svelte-i18n'

register('en', () => import('./../locale/en.json'))
register('cs', () => import('./../locale/cs.json'))

let forceLang: string | undefined
// forceLang = 'cs'

init({
    fallbackLocale: 'en',
    initialLocale: forceLang ?? getLocaleFromNavigator(),
})

if (forceLang) console.error('Forcing language: ', forceLang)
