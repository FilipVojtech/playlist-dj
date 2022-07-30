<script lang="ts">
    import type { PDJ } from '@playlist-dj/types'
    import { Header, PlaylistList } from '../components'
    import { ImportM3UFileModal, ImportPlaylistModal, MergePlaylistsModal, Modal } from '../components/modals'
    import { CreatePlaylist } from '../components/widgets'
    import { _ } from 'svelte-i18n'
    import aport from '../utility/Aport'
    import { onMount } from 'svelte'
    import { LoaderIcon, MoreHorizontalIcon } from 'svelte-feather-icons'
    import { closeModal, openModal } from 'svelte-modals'
    import { ModalAction } from '../utility'
    import { modalEvent } from '../utility/stores'

    let data: Promise<PDJ.Playlist[]> = new Promise<[]>(() => [])

    function getPlaylists() {
        data = aport('/api/playlist?src=app')
            .then(value => {
                if (value.ok) return value.json()
                else return []
            })
            .catch(e => {
                console.error(e)
                return []
            })
    }

    function openOptions() {
        openModal(Modal, {
            title: $_('app.actions'),
            actions: [
                new ModalAction($_('page.playlistList.more.mergePlaylists'), () => {
                    closeModal()
                    openModal(MergePlaylistsModal)
                }),
                new ModalAction(
                    $_('page.playlistList.more.importPlaylist'),
                    () => {
                        closeModal()
                        openModal(ImportPlaylistModal)
                    },
                    false
                ),
                new ModalAction(
                    $_('page.playlistList.more.importM3U'),
                    () => {
                        closeModal()
                        openModal(ImportM3UFileModal)
                    },
                    false
                ),
                new ModalAction($_('app.cancel'), closeModal),
            ],
        })
    }

    onMount(getPlaylists)

    $: if ($modalEvent === 'playlistMerge') {
        getPlaylists()
        $modalEvent = ''
    }
</script>

<svelte:head>
    <title>{$_('page.playlistList.title')}</title>
</svelte:head>
<Header iconAfter={MoreHorizontalIcon} onClickAfter={openOptions} text={$_('page.playlistList.title')} />

<div class="list">
    <CreatePlaylist half />
    {#await data}
        <div class="loader">
            <LoaderIcon size="35" />
        </div>
    {:then playlists}
        <PlaylistList half {playlists} />
    {:catch e}
        {@debug e}
        <p>{e}</p>
    {/await}
</div>
