<script lang='ts'>
    import { Header } from '../components'
    import { onDestroy, onMount } from 'svelte'
    import { showNav } from '../Utility/stores'
    import { _ } from 'svelte-i18n'

    export let params = {
        id: '',
    }
    let id = params.id

    onMount(() => $showNav = false)
    onDestroy(() => $showNav = true)
</script>

<svelte:head>
    <title>{$_('page.playlist.title')}</title>
</svelte:head>
<Header />
<p>Id: {id}</p>
