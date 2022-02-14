<script lang='ts'>
    import { onDestroy, onMount } from 'svelte'
    import { _ } from 'svelte-i18n'
    import { showNav } from '../../Utility/stores'
    import { Header } from '../../components'
    import { ChevronLeftIcon } from 'svelte-feather-icons'
    import { push } from 'svelte-spa-router'

    onMount(() => $showNav = false)
    onDestroy(() => $showNav = true)
</script>

<Header iconBefore={ChevronLeftIcon} onClickBefore={() => push('/settings')} text={$_('page.settings.profile.title')} />
