<script>
    import { push } from 'svelte-spa-router'
    import { SettingsIcon } from 'svelte-feather-icons'
    import { getCookies } from '../Utility'
    import Title from '../components/Title.svelte'

    const user = getCookies().user
</script>

<main>
    <Title iconAfter={SettingsIcon} onClickAfter={() => push('/settings')} text={`Welcome ${user['displayName']}!`} />
</main>
