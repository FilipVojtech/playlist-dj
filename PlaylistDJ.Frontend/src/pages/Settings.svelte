<script lang='ts'>
    import Title from '../components/Title.svelte'
    import Footer from '../components/Footer.svelte'
    import { ChevronLeftIcon } from 'svelte-feather-icons'
    import { pop } from 'svelte-spa-router'
    import { onDestroy, onMount } from 'svelte'
    import { showNav } from '../Utility/stores'
    import { _ } from 'svelte-i18n'

    onMount(() => $showNav = false)
    onDestroy(() => $showNav = true)
</script>

<svelte:head>
    <title>{$_('page.settings.title')}</title>
</svelte:head>
<Title iconBefore={ChevronLeftIcon} onClickBefore={pop} text={$_('page.settings.title')} />
<Footer />
