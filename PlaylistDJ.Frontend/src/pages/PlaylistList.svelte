<script lang="ts">
    import type { PDJ } from '@playlist-dj/types'
    import { Header, PlaylistList } from '../components'
    import { ImportM3UFileModal, ImportPlaylistModal, Modal } from '../components/modals'
    import { CreatePlaylist } from '../components/widgets'
    import { _ } from 'svelte-i18n'
    import aport from '../utility/Aport'
    import { onMount } from 'svelte'
    import { LoaderIcon } from 'svelte-feather-icons'
    import { closeModal, closeModals, openModal } from 'svelte-modals'
    import { ModalAction } from '../utility'

    let data: Promise<PDJ.Playlist[]> = new Promise<[]>(() => [])

    onMount(async () => {
        data = aport('/api/playlist?src=app')
            .then(value => {
                if (value.ok) return value.json()
                else return []
            })
            .catch(e => {
                console.error(e)
                return []
            })
    })

    function handleClick() {
        openModal(Modal, {
            title: $_('app.actions'),
            actions: [
                new ModalAction($_('page.playlistList.more.importPlaylist'), () => {
                    closeModals()
                    openModal(ImportPlaylistModal)
                }),
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
        <PlaylistList half {playlists} />
    {:catch e}
        <p>{e}</p>
    {/await}
</div>
