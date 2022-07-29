<script lang="ts">
    import type { PDJ, SearchFilter } from '@playlist-dj/types'
    import { FilterType } from '@playlist-dj/types'
    import { fade, slide } from 'svelte/transition'
    import { closeModals } from 'svelte-modals'
    import { _ } from 'svelte-i18n'
    import { onMount } from 'svelte'
    import aport from '../../utility/Aport'
    import { XIcon } from 'svelte-feather-icons'
    import { modalEvent } from '../../utility/stores'

    export let isOpen: boolean

    let playlists: PDJ.Playlist[] = []
    let playlist: PDJ.Playlist | null = null
    $: playlistsToSelect = playlists.filter(value => !(selectedPlaylists.find(x => x.id === value.id) ? true : false)) // !selectedPlaylists.includes(value.id)
    // $: playlistsToSelect = playlists.filter(value => !selectedPlaylists.includes(value))
    let selectedPlaylists: SearchFilter[] = []
    let playlistName: string = ''

    function handlePlaylistSelect() {
        if (playlist === null) return
        selectedPlaylists = [...selectedPlaylists, { id: playlist.id, type: FilterType.Playlist, name: playlist.name }]
        playlist = null
    }

    function handlePlaylistRemove(playlistId: string) {
        const playlistIndex = selectedPlaylists.findIndex(value => value.id === playlistId)
        if (playlistIndex !== -1) selectedPlaylists.splice(playlistIndex, 1)
        selectedPlaylists = selectedPlaylists
    }

    async function mergePlaylists() {
        closeModals()
        selectedPlaylists.forEach(value => delete value.name)
        await aport(`/api/playlist/link`, {
            method: 'POST',
            body: JSON.stringify({ name: playlistName, playlists: selectedPlaylists }),
        })
        $modalEvent = 'playlistMerge'
    }

    onMount(async () => {
        playlists = await aport(`/api/playlist?src=link`)
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
            <div class="modal__title">{$_('modal.merge.title')}</div>
            <div class="modal__message">
                <form class="form" on:submit|preventDefault={mergePlaylists}>
                    <label class="form__label" for="playlistName">{$_('modal.merge.playlistName')}</label>
                    <input
                        class="form__input"
                        id="playlistName"
                        bind:value={playlistName}
                        placeholder={$_('modal.merge.newPlaylistName')}
                        autocomplete="off"
                        required
                    />
                    <label class="form__label" for="playlists">{$_('modal.merge.playlists')}</label>
                    <select
                        class="form__input"
                        name="playlist"
                        id="playlists"
                        bind:value={playlist}
                        on:change={handlePlaylistSelect}
                    >
                        <option value={null}>{$_('modal.merge.choosePlaylist')}</option>
                        {#each playlistsToSelect as playlist (playlist.id)}
                            <option value={playlist}>{playlist.name}</option>
                        {/each}
                    </select>
                    {#if selectedPlaylists.length > 0}
                        <label
                            for="selectedPlaylists"
                            class="form__label"
                            in:slide|local
                            out:slide|local={{ delay: 200 }}
                        >
                            {$_('modal.merge.selectedPlaylists')}
                        </label>
                        <ul id="selectedPlaylists" class="playlists__list" transition:slide|local>
                            {#each selectedPlaylists as playlist}
                                <li
                                    class="list__item"
                                    on:click={() => handlePlaylistRemove(playlist.id)}
                                    transition:slide|local
                                >
                                    <span class="item__remove item--warning"><XIcon /></span>{playlist.name}
                                </li>
                            {/each}
                        </ul>
                    {/if}
                    <div class="modal__actions">
                        <input
                            type="submit"
                            class="actions__button"
                            value={$_('modal.merge.merge')}
                            disabled={selectedPlaylists.length < 2 && playlistName}
                            class:item__actions__action--disabled={selectedPlaylists.length < 2 && playlistName}
                        />
                        <button class="actions__button" on:click|preventDefault={closeModals}>
                            {$_('app.cancel')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
{/if}

<style>
    .playlists__list {
        text-align: left;
        list-style: none;
    }

    .list__item {
        margin-left: 5px;
        padding: 5px 0;
        cursor: pointer;
    }

    .item__remove {
        display: inline-block;
        margin-right: 5px;
        height: 1em;
        aspect-ratio: 1 / 1;
        transform: translateY(4px);
    }
</style>
