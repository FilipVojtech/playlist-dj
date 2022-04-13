<script lang='ts'>
    import { fade } from 'svelte/transition'
    import { closeModal } from 'svelte-modals'
    import aport from '../Utility/Aport'
    import { ListIcon, LoaderIcon, XOctagonIcon } from 'svelte-feather-icons'
    import { onMount } from 'svelte'
    import { _ } from 'svelte-i18n'
    import FilterPlaceholder from './FilterPlaceholder.svelte'

    export let isOpen: boolean

    let value: string = ''
    let playlistId: string
    let data = new Promise<[]>(() => [])

    function sendPost() {
        console.log('Message', value)
        console.log('PL', playlistId)
        aport('/api/social', {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: value, playlist: playlistId }),
            method: 'POST',
        })
        closeModal()
    }

    onMount(() => {
        data = aport('/api/playlist')
            .then(value => value.json())
    })
</script>

{#if isOpen}
    <div role='dialog' class='modal' transition:fade>
        <div class='modal__contents'>
            <div class='modal__title'>{$_('page.social.create.title')}</div>
            <form class='form' on:submit|preventDefault>
                <textarea bind:value class='textarea form__input' rows='10' maxlength='256'
                          placeholder="What's poppin'?"></textarea>
                {#await data}
                    <span class='loader'><LoaderIcon /></span>
                {:then playlists}
                    {@debug playlists}
                    {#if playlists}
                        <select bind:value={playlistId} class='form__input'>
                            {#each playlists as { id, name }}
                                <option value='{id}'>{name}</option>
                            {/each}
                        </select>
                    {:else}
                        <div class='item filter'>
                            <FilterPlaceholder icon={ListIcon} />
                            <div class='filter__info'>{$_('page.social.create.nothingFound')}</div>
                        </div>
                    {/if}
                {:catch e}
                    <div class='item filter'>
                        <FilterPlaceholder icon={XOctagonIcon} />
                        <div class='filter__info'>{$_('page.social.create.cantLoad')}</div>
                    </div>
                {/await}
            </form>
            <div class='modal__actions'>
                <button class='actions__button' class:actions__button--inactive={!playlistId}
                        disabled='{!playlistId}' on:click={sendPost}>{$_('page.social.create.post')}</button>
                <button class='actions__button' on:click={closeModal}>{$_('app.cancel')}</button>
            </div>
        </div>
    </div>
{/if}

<style>
    .textarea {
        resize: vertical;
        padding: 10px;
        font-size: 16px;
    }
</style>
