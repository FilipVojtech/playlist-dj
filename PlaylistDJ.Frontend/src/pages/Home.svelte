<script lang='ts'>
    import { push } from 'svelte-spa-router'
    import { SettingsIcon } from 'svelte-feather-icons'
    import { getCookies } from '../Utility'
    import { Header } from '../components'
    import { _ } from 'svelte-i18n'

    const user = getCookies().user
</script>

<svelte:head>
    <title>{$_('page.home.title')}</title>
</svelte:head>
<main>
    <!--todo: Create type defs for user cookie-->
    <Header
        iconAfter={SettingsIcon}
        onClickAfter={() => push('/settings')}
        text={$_('page.home.greeting', { values: { user: user['displayName'] } })}
    />
</main>
