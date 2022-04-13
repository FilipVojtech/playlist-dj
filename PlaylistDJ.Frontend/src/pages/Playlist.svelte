<script lang='ts'>
    import { Header, SpotifySearchModal } from '../components'
    import { onDestroy, onMount } from 'svelte'
    import { searchResult, showNav } from '../Utility/stores'
    import { _ } from 'svelte-i18n'
    import { PlusCircleIcon } from 'svelte-feather-icons'
    import aport from '../Utility/Aport'
    import { getCookies } from '../Utility'
    import LoginWidget from '../components/widgets/LoginWidget.svelte'
    import { openModal } from 'svelte-modals'

    export let params = { id: '' }

    const locationHash = window.location.hash
    const isNew = locationHash.endsWith('/new')
    const isEditing = locationHash.endsWith('/edit')
    let data = {}

    onMount(() => {
        $showNav = false
        data = aport(`/api/playlist/${params.id}`)
            .then(value => value.json())
    })
    onDestroy(() => $showNav = true)

    $: if ($searchResult.id) {
        aport(`/api/playlist/${params.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify($searchResult),
        })
        $searchResult = {}
    }
</script>

<svelte:head>
    {#if isEditing}
        <title>Editing {$_('page.playlist.title')}</title>
    {:else if isNew}
        <title>Creating a playlist</title>
    {:else}
        <title>{$_('page.playlist.title')}</title>
    {/if}
</svelte:head>

{#await data then playlist}
    {#if playlist.status === 404}
        <Header text='Playlist not found' />
    {:else if playlist.status === 403}
        <Header text='This playlist is private' />
        {#if !getCookies().user}
            <LoginWidget message='You can try logging in' />
        {/if}
    {:else if getCookies().user}
        <Header />
    {/if}

    <p>Id: {params.id}</p>

    {#if getCookies().user && (isNew || isEditing)}
        <div on:click={() => openModal(SpotifySearchModal)}>
            <PlusCircleIcon size='50' />
        </div>
    {/if}


{:catch e}
    <h1>Error</h1>
    <p>{e}</p>
{/await}
<button on:click={() => data = aport(`/api/playlist/${params.id}`, { method: 'GET' })}
        style='color: black'>GET
</button>
<button on:click={() => aport(`/api/playlist/${params.id}`, { method: 'PUT' })} style='color: black'>PUT</button>
<button on:click={() => aport(`/api/playlist/${params.id}`, { method: 'DELETE' })} style='color: black'>DELETE</button>
