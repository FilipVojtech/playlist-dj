<script lang="ts">
    import type { PDJ } from '@playlist-dj/types'
    import { fade } from 'svelte/transition'
    import { closeAllModals, closeModal } from 'svelte-modals'
    import { onMount } from 'svelte'
    import aport from '../../utility/Aport'
    import { LoaderIcon } from 'svelte-feather-icons'
    import PlaylistList from '../PlaylistList.svelte'
    import { _ } from 'svelte-i18n'

    export let isOpen: boolean
    let data: Promise<PDJ.Playlist[]> = new Promise<[]>(() => [])

    async function submit(e) {
        closeAllModals()
        await aport('/api/playlist', {
            method: 'POST',
            body: JSON.stringify({ id: e.detail.id }),
        })
    }

    onMount(async () => {
        data = aport('/api/playlist?src=spotify')
            .then(res => {
                if (res.ok) return res.json()
                else return []
            })
            .catch(e => {
                console.error(e)
                return []
            })
    })
</script>

{#if isOpen}
    <div role="dialog" class="modal" transition:fade>
        <div class="modal__contents">
            <div class="modal__title">{$_('modal.importPlaylist.title')}</div>
            <div class="modal__message">
                {#await data}
                    <div class="loader">
                        <LoaderIcon />
                    </div>
                {:then playlists}
                    <PlaylistList {playlists} on:click={submit} useCustom />
                {/await}
            </div>
            <div class="modal__actions modal__actions--sticky">
                <button class="actions__button" on:click={closeModal}>{$_('app.cancel')}</button>
            </div>
        </div>
    </div>
{/if}
