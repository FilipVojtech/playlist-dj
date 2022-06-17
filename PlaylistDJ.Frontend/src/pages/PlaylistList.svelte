<script lang="ts">
    import { Header, ImportM3UFileModal, Modal, PlaylistList } from '../components'
    import { _ } from 'svelte-i18n'
    import aport from '../utility/Aport'
    import { onMount } from 'svelte'
    import { LoaderIcon } from 'svelte-feather-icons'
    import { closeModal, closeModals, openModal } from 'svelte-modals'
    import { push } from 'svelte-spa-router'
    import CreatePlaylist from '../components/widgets/CreatePlaylist.svelte'
    import { ModalAction } from '../utility'

    let data: Promise<[]> = new Promise<[]>(() => [])

    onMount(async () => {
        data = aport('/api/playlist?src=app').then(value => value.json())
    })

    function handleClick() {
        openModal(Modal, {
            title: $_('app.actions'),
            actions: [
                // {
                //     title: $_('page.playlistList.more.importPlaylist'),
                //     onClick: () => {
                //         closeModals()
                //         openModal(ImportPlaylistModal)
                //     },
                // },
                new ModalAction($_('page.playlistList.more.importM3U'), () => {
                    closeModals()
                    openModal(ImportM3UFileModal)
                }),
                new ModalAction($_('app.cancel'), closeModal),
            ],
        })
    }
</script>

<svelte:head>
    <title>{$_('page.playlistList.title')}</title>
</svelte:head>
<!--<Header iconAfter={MoreHorizontalIcon} onClickAfter={handleClick} text={$_('page.playlistList.title')} />-->
<Header text={$_('page.playlistList.title')} />

<div class="list">
    <CreatePlaylist half />
    {#await data}
        <div class="loader">
            <LoaderIcon size="35" />
        </div>
    {:then playlists}
        <PlaylistList half {playlists} on:click={e => push(`/playlist/${e.detail.id}`)} />
    {:catch e}
        <p>{e}</p>
    {/await}
</div>
