<script lang="ts">
    import { fade } from 'svelte/transition'
    import { _ } from 'svelte-i18n'
    import { closeModal } from 'svelte-modals'
    import aport from '../../utility/Aport'
    import { modalEvent } from '../../utility/stores'

    export let isOpen: boolean
    export let id: string
    export let name: string = ''
    export let description: string = ''

    function handleSubmit() {
        aport(`/api/playlist/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ name, description }),
        }).then(() => ($modalEvent = 'detailsChange'))
        closeModal()
    }
</script>

{#if isOpen}
    <div role="dialog" class="modal" transition:fade>
        <form class="form modal__contents">
            <div class="modal__title">{$_('modal.editPlaylistDetails.title')}</div>
            <form class="form" on:submit|preventDefault={handleSubmit}>
                <label class="form__label" for="playlistName">{$_('modal.editPlaylistDetails.playlistName')}</label>
                <input
                    type="text"
                    name="name"
                    id="playlistName"
                    maxlength="100"
                    required
                    placeholder={$_('modal.editPlaylistDetails.playlistName')}
                    class="form__input"
                    autocomplete="off"
                    bind:value={name}
                />
                <label for="description">{$_('modal.editPlaylistDetails.playlistDescription')}</label>
                <!--suppress CheckEmptyScriptTag -->
                <textarea
                    name="description"
                    id="description"
                    maxlength="300"
                    rows="6"
                    placeholder={$_('modal.editPlaylistDetails.playlistDescription')}
                    class="form__input textarea textarea--no-resize"
                    bind:value={description}
                    required
                    on:keydown={e => {
                        if (e.key === 'Enter' || e.key === 'Return') handleSubmit()
                    }}
                />
                <div class="modal__actions">
                    <input type="submit" class="actions__button" value={$_('app.save')} />
                    <button class="actions__button" on:click|preventDefault={closeModal}>{$_('app.cancel')}</button>
                </div>
            </form>
        </form>
    </div>
{/if}
