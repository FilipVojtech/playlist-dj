<script lang='ts'>
    import { Header, ImportM3UFileModal, Modal, PlaylistList } from '../components'
    import { _ } from 'svelte-i18n'
    import aport from '../utility/Aport'
    import { onMount } from 'svelte'
    import { LoaderIcon, MoreHorizontalIcon } from 'svelte-feather-icons'
    import { closeModal, closeModals, openModal } from 'svelte-modals'
    import { push } from 'svelte-spa-router'
    import CreatePlaylist from '../components/widgets/CreatePlaylist.svelte'

    let data: Promise<[]> = new Promise<[]>(() => [])

    onMount(async () => {
        data = aport('/api/playlist?src=app')
            .then(value => value.json())
    })

    function handleClick() {
        openModal(Modal, {
            title: 'Actions',
            actions: [
                // {
                //     title: $_('page.playlistList.more.importPlaylist'),
                //     onClick: () => {
                //         closeModals()
                //         openModal(ImportPlaylistModal)
                //     },
                // },
                {
                    title: $_('page.playlistList.more.importM3U'),
                    onClick: () => {
                        closeModals()
                        openModal(ImportM3UFileModal)
                    },
                },
                {
                    title: 'Close',
                    onClick: closeModal,
                },
            ],
        })
    }
</script>

<svelte:head>
    <title>{$_('page.playlistList.title')}</title>
</svelte:head>
<Header iconAfter={MoreHorizontalIcon} onClickAfter={handleClick} text={$_('page.playlistList.title')} />

<div class='list'>
    <CreatePlaylist half />
    {#await data }
        <div class='loader'>
            <LoaderIcon />
        </div>
    {:then playlists}
        <PlaylistList half {playlists} on:click={(e) => push(`/playlist/${e.detail.id}`)} />
    {:catch e}
        <p>{e}</p>
    {/await}
</div>
