<script lang="ts">
    import type { PDJ } from '@playlist-dj/types'
    import { fade } from 'svelte/transition'
    import { closeModal } from 'svelte-modals'
    import aport from '../../utility/Aport'
    import { ListIcon, LoaderIcon, XOctagonIcon } from 'svelte-feather-icons'
    import { onMount } from 'svelte'
    import { _ } from 'svelte-i18n'
    import Filter from '../Filter.svelte'

    export let isOpen: boolean
    export let onCreate: Function

    let value: string = ''
    let playlistId: string
    let data: Promise<PDJ.Playlist[]> = new Promise(() => [])

    async function createPost() {
        await aport('/api/social', {
            method: 'POST',
            body: JSON.stringify({ message: value, playlist: playlistId }),
        })
        onCreate()
        closeModal()
    }

    function loadPlaylists() {
        data = aport('/api/playlist')
            .then(value => {
                if (value.ok) return value.json() as PDJ.Playlist[]
                else return []
            })
            .catch(e => {
                console.error(e)
                return []
            })
    }

    onMount(loadPlaylists)
</script>

{#if isOpen}
    <div role="dialog" class="modal" transition:fade>
        <div class="modal__contents">
            <div class="modal__title">{$_('modal.createPost.title')}</div>
            <form class="form" on:submit|preventDefault={createPost}>
                <!--suppress CheckEmptyScriptTag -->
                <textarea
                    bind:value
                    class="textarea form__input"
                    rows="7"
                    maxlength="512"
                    placeholder={$_('modal.createPost.whatsUp')}
                    name="description"
                    id="description"
                />
                {#await data}
                    <span class="loader"><LoaderIcon size="35" /></span>
                {:then playlists}
                    {#if playlists.length > 0}
                        <label for="playlist">{$_('modal.createPost.playlist')}</label>
                        <select bind:value={playlistId} name="playlist" id="playlist" class="form__input">
                            {#each playlists as { id, name }}
                                <option value={id}>{name}</option>
                            {/each}
                        </select>
                    {:else}
                        <Filter name={$_('modal.createPost.nothingFound')} placeholderIcon={ListIcon} />
                    {/if}
                {:catch e}
                    <Filter name={$_('modal.createPost.cantLoad')} placeholderIcon={XOctagonIcon} />
                {/await}
                <div class="modal__actions">
                    <input
                        type="submit"
                        value={$_('modal.createPost.post')}
                        class="actions__button"
                        class:actions__button--inactive={!playlistId}
                        disabled={!playlistId}
                    />
                    <button class="actions__button" on:click={closeModal}>{$_('app.cancel')}</button>
                </div>
            </form>
        </div>
    </div>
{/if}
