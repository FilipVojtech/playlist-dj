<script>
    import { link } from 'svelte-spa-router'
    import { SettingsIcon } from 'svelte-feather-icons'
    import { getCookies } from '../Utility'

    const user = getCookies().user
</script>

<main>
    <h1>Welcome {user['displayName']}!</h1>
    <a class='nav__link' href='/settings' use:link>
        <SettingsIcon size='40' />
    </a>
</main>

